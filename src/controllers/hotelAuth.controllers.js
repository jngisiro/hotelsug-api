import { promisify } from "util";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import Hotel from "../models/hotel.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/app-error";
import Email from "../utils/email";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAuthToken = (hotel, statusCode, res) => {
  // Generate auth token using new hotel's id
  const token = signToken(hotel._id);
  const expiresIn = new Date(
    new Date().getTime() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000
  );

  const cookieOptions = {
    expiresIn,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Hide password from the returned hotel data
  hotel.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    expiresIn,
    data: {
      hotel,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Check if email is already registered
  const hotel = await Hotel.findOne({ email: req.body.email });

  if (hotel)
    return next(
      new AppError("Hotel with that email is already registered", 403)
    );

  const newHotel = await Hotel.create(req.body);

  // Generate account activation token
  const token = newHotel.createToken("confirmAccount");
  await newHotel.save({ validateBeforeSave: false });

  const confirmationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/hotels/confirmAccount/${token}`;

  await new Email(newHotel, confirmationUrl).sendHotelWelcome();

  res.status(201).json({
    status: "Success",
    data: {
      message: "Account created. Check your email to confirm your account",
    },
  });
});

exports.confirmAccout = catchAsync(async (req, res, next) => {
  // get token from the url
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const hotel = await Hotel.findOne({
    confirmAccountToken: hashedToken,
    confirmAccountExpires: { $gt: Date.now() },
  });

  // If there is no hotel, then the token is invalid or has expired
  if (!hotel) return next(new AppError("Token is invalid or has expired", 400));

  hotel.accountActivated = true;
  hotel.confirmAccountToken = undefined;
  hotel.confirmAccountExpires = undefined;
  await hotel.save({ validateBeforeSave: false });

  const redirectUrl = `https://youthful-poincare-7c7cce.netlify.app/confirmAccount`;

  res.redirect(`${redirectUrl}/?success=true`);
});

exports.login = catchAsync(async (req, res, next) => {
  // Destructure the email and password for email and password fields
  const { email, password } = req.body;

  // Check if email and password have been submitted
  if (!email || !password)
    return next(new AppError("Email and Password required", 400));

  // Check if the hotel exists && password is correct
  const hotel = await Hotel.findOne({ email }).select("+password"); // +password to select field not selected by default

  if (!hotel || !(await hotel.correctPassword(password, hotel.password)))
    // If call to compare passwords returns false generate AppError
    return next(new AppError("Incorrect Email or Password", 401));

  // If everything is ok, send jwt back to client
  createAuthToken(hotel, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get the token and check if it exists
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError("Please login", 401));

  // Verify the token. jwt.verify requires a callback which is converted to an async function using promisify
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if hotel still exists
  const checkHotel = await Hotel.findById(decoded.id);
  if (!checkHotel)
    return next(
      new AppError("Hotel no longer exists. Please login again", 401)
    );

  // Check if hotel's password changed after the token was issued
  if (checkHotel.changedPasswordAfterToken(decoded.iat))
    return next(
      new AppError("Hotel's password recently changed, Please login again", 401)
    );

  // GRANT ACCESS TO PROTECTED ROUTE
  req.hotel = checkHotel;
  next();
});

// Logout the user
exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ["user", "admin", "superadmin", "gm", "manager", "attendant"]
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};

// Handle forgotten password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if user is registered with provided email
  const hotel = await Hotel.findOne({ email: req.body.email });
  if (!hotel)
    return next(new AppError("There is no hotel with that email address", 404));

  // Generate random reset token
  const resetToken = hotel.createToken("resetPassword");
  await hotel.save({ validateBeforeSave: false });

  try {
    // Send the token back as reset link
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/hotels/resetPassword/${resetToken}}`;

    await new Email(hotel, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "Success",
      message: "Reset token sent to email address",
    });
  } catch (err) {
    hotel.passwordResetToken = undefined;
    hotel.passwordResetExpires = undefined;
    await hotel.save({ validateBeforeSave: false });

    return next(new AppError("Error sending email. Try again later", 500));
  }
});

// Handle password reset
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user with token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // get user with the hashed token and check if token hasn't yet expiried
  const hotel = await Hotel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If there is no user, then the token is invalid or has expired
  if (!hotel) return next(new AppError("Token is invalid or has expired", 400));

  // Update user's new password and delete the reset token and reset exipry
  hotel.password = req.body.password;
  hotel.passwordConfirm = req.body.password;
  hotel.passwordResetToken = undefined;
  hotel.passwordResetExpires = undefined;
  await hotel.save();

  // Sign in hotel and send an auth token
  createAuthToken(hotel, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get hotel
  const hotel = await Hotel.findById(req.user.id).select("+password");

  // Check is previous password ic correct
  if (!(await hotel.correctPassword(req.body.currentPassword, hotel.password)))
    return next(new AppError("Current password is incorrect", 401));

  // Update to new password
  hotel.password = req.body.password;
  hotel.passwordConfirm = req.body.passwordConfirm;
  await hotel.save();

  // Send new auth tokrn
  createAuthToken(hotel, 200, res);
});
