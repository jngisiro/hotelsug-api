"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("util"),
    promisify = _require.promisify;

var jwt = require("jsonwebtoken");

var crypto = require("crypto");

var User = require("../models/user.model");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/app-error");

var Email = require("../utils/email");

var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createAuthToken = function createAuthToken(user, statusCode, res) {
  // Generate auth token using new user's id
  var token = signToken(user._id);
  var expiresIn = new Date(new Date().getTime() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000);
  var cookieOptions = {
    expiresIn: expiresIn,
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions); // Hide password from the returned user data

  user.password = undefined;
  res.status(statusCode).json({
    status: "Success",
    token: token,
    expiresIn: expiresIn,
    data: {
      user: user
    }
  });
};

exports.signup = catchAsync( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var user, newUser, token, confirmationUrl;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return User.findOne({
              email: req.body.email
            });

          case 2:
            user = _context.sent;

            if (!user) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", next(new AppError("Email is already registered", 403)));

          case 5:
            _context.next = 7;
            return User.create({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              password: req.body.password,
              passwordConfirm: req.body.passwordConfirm
            });

          case 7:
            newUser = _context.sent;
            // Generate account activation token
            token = newUser.createToken("confirmAccount");
            _context.next = 11;
            return newUser.save({
              validateBeforeSave: false
            });

          case 11:
            confirmationUrl = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/confirmAccount/").concat(token);
            _context.next = 14;
            return new Email(newUser, confirmationUrl).sendWelcome();

          case 14:
            res.status(201).json({
              status: "Success",
              data: {
                message: "Account created. Check your email to confirm your account"
              }
            });

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
exports.confirmAccout = catchAsync( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var hashedToken, user, redirectUrl;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // get token from the url
            hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
            _context2.next = 3;
            return User.findOne({
              confirmAccountToken: hashedToken,
              confirmAccountExpires: {
                $gt: Date.now()
              }
            });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", next(new AppError("Token is invalid or has expired", 400)));

          case 6:
            user.accountActivated = true;
            user.confirmAccountToken = undefined;
            user.confirmAccountExpires = undefined;
            _context2.next = 11;
            return user.save({
              validateBeforeSave: false
            });

          case 11:
            redirectUrl = "https://youthful-poincare-7c7cce.netlify.app/confirmAccount";
            res.redirect("".concat(redirectUrl, "/?success=true"));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
exports.login = catchAsync( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body, email, password, user;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Destructure the email and password for email and password fields
            _req$body = req.body, email = _req$body.email, password = _req$body.password; // Check if email and password have been submitted

            if (!(!email || !password)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", next(new AppError("Email and Password required", 400)));

          case 3:
            _context3.next = 5;
            return User.findOne({
              email: email
            }).select("+password");

          case 5:
            user = _context3.sent;
            _context3.t0 = !user;

            if (_context3.t0) {
              _context3.next = 11;
              break;
            }

            _context3.next = 10;
            return user.correctPassword(password, user.password);

          case 10:
            _context3.t0 = !_context3.sent;

          case 11:
            if (!_context3.t0) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", next(new AppError("Incorrect Email or Password", 401)));

          case 13:
            // If everything is ok, send jwt back to client
            createAuthToken(user, 200, res);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
exports.protect = catchAsync( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var token, decoded, checkUser;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // Get the token and check if it exists
            token = "";

            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
              token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies.jwt) {
              token = req.cookies.jwt;
            }

            if (token) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", next(new AppError("Please login", 401)));

          case 4:
            _context4.next = 6;
            return promisify(jwt.verify)(token, process.env.JWT_SECRET);

          case 6:
            decoded = _context4.sent;
            _context4.next = 9;
            return User.findById(decoded.id);

          case 9:
            checkUser = _context4.sent;

            if (checkUser) {
              _context4.next = 12;
              break;
            }

            return _context4.abrupt("return", next(new AppError("User no longer exists. Please login again", 401)));

          case 12:
            if (!checkUser.changedPasswordAfterToken(decoded.iat)) {
              _context4.next = 14;
              break;
            }

            return _context4.abrupt("return", next(new AppError("User recently changed password, Please login again", 401)));

          case 14:
            // GRANT ACCESS TO PROTECTED ROUTE
            req.user = checkUser;
            next();

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Logout the user

exports.logout = function (req, res) {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: "success"
  });
}; // Restrict certain routes to authorized user roles


exports.restrictTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    // roles ["user", "admin", "superadmin", "gm", "manager", "attendant"]
    if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission to perform this action", 403));
    next();
  };
}; // Handle forgotten password


exports.forgotPassword = catchAsync( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var user, resetToken, resetURL;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return User.findOne({
              email: req.body.email
            });

          case 2:
            user = _context5.sent;

            if (user) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return", next(new AppError("There is no user with that email address", 404)));

          case 5:
            // Generate random reset token
            resetToken = user.createToken("resetPassword");
            _context5.next = 8;
            return user.save({
              validateBeforeSave: false
            });

          case 8:
            _context5.prev = 8;
            // Send the token back as reset link
            resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/resetPassword/").concat(resetToken, "}");
            _context5.next = 12;
            return new Email(user, resetURL).sendPasswordReset();

          case 12:
            res.status(200).json({
              status: "Success",
              message: "Reset token sent to email address"
            });
            _context5.next = 22;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](8);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            _context5.next = 21;
            return user.save({
              validateBeforeSave: false
            });

          case 21:
            return _context5.abrupt("return", next(new AppError("Error sending email. Try again later", 500)));

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[8, 15]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Handle password reset

exports.resetPassword = catchAsync( /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var hashedToken, user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // get user with token
            hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); // get user with the hashed token and check if token hasn't yet expiried

            _context6.next = 3;
            return User.findOne({
              passwordResetToken: hashedToken,
              passwordResetExpires: {
                $gt: Date.now()
              }
            });

          case 3:
            user = _context6.sent;

            if (user) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", next(new AppError("Token is invalid or has expired", 400)));

          case 6:
            // Update user's new password and delete the reset token and reset exipry
            user.password = req.body.password;
            user.passwordConfirm = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            _context6.next = 12;
            return user.save();

          case 12:
            // Sign in user and send an auth token
            createAuthToken(user, 200, res);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
exports.updatePassword = catchAsync( /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return User.findById(req.user.id).select("+password");

          case 2:
            user = _context7.sent;
            _context7.next = 5;
            return user.correctPassword(req.body.currentPassword, user.password);

          case 5:
            if (_context7.sent) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", next(new AppError("Current password is incorrect", 401)));

          case 7:
            // Update to new password
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            _context7.next = 11;
            return user.save();

          case 11:
            // Send new auth tokrn
            createAuthToken(user, 200, res);

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());