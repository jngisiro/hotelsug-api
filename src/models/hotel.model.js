import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Provide the Hotel name"],
      unique: true,
      maxlength: [40, "Name must have less than 40 characters"],
      minlength: [10, "Name must have more than 10 characters"],
    },

    location: {
      type: String,
      required: [true, "Hotel must have a location"],
    },

    slug: String,

    email: {
      type: String,
      required: [true, "Hotel Email Address is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    contactNumber: {
      type: String,
      required: [true, "Provide a contact number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    passwordConfirm: {
      type: String,
      required: [true, "Password is required"],
    },

    website: String,

    images: { type: [String] },

    coverImage: { type: String },

    description: {
      type: String,
      trim: true,
      required: [true, "Provide the Hotel description"],
    },

    facilities: {
      type: [String],
      trim: true,
    },

    languages: [String],

    availability: {
      type: Boolean,
      default: true,
    },

    active: false,

    price: {
      deluxe: Number,
      double: Number,
      ordinary: Number,
    },

    role: {
      type: String,
      default: "manager",
    },

    rating: Number, // The average rating

    ratings: Number, // Number of ratings

    supportedPayments: {
      type: [String],
    },

    rules: [String],

    address: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      location: {
        type: String,
        trim: true,
        required: [true, "Provide the Hotel location"],
      },
      fullAddress: {
        type: String,
        trim: true,
        required: [true, "Provide the Hotel address"],
      },
      region: {
        type: String,
        trim: true,
        required: [true, "Provide the Hotel region"],
      },
    },
    private: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This function runs everytime a new document is created or saved in the database
hotelSchema.pre("save", async function (next) {
  // check if the password field has been modified before running the hash or exiting if not
  if (!this.isModified("password")) return next();

  // Password hashed
  this.password = await bcrypt.hash(this.password, 12);

  // Ignores / deletes the passwordconfirm field
  this.passwordConfirm = undefined;

  // Onto the next middleware
  next();
});

hotelSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

hotelSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

hotelSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// eslint-disable-next-line camelcase
hotelSchema.methods.changedPasswordAfterToken = function (JWT_timeStamp) {
  // Check if user has chnaged password
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // eslint-disable-next-line camelcase
    return JWT_timeStamp < changedTimeStamp;
  }

  // False means password not changed after token was issued
  return false;
};

hotelSchema.methods.createToken = function (operation) {
  const token = crypto.randomBytes(32).toString("hex");

  if (operation === "confirmAccount") {
    this.confirmAccountToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.confirmAccountExpires = Date.now() + 60 * 60 * 1000;
  } else {
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  }

  return token;
};

hotelSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

hotelSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "hotel",
  localField: "_id",
});

hotelSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "hotel",
  localField: "_id",
});

hotelSchema.virtual("favs", {
  ref: "Favs",
  foreignField: "hotel",
  localField: "_id",
});

hotelSchema.virtual("views", {
  ref: "Views",
  foreignField: "hotel",
  localField: "_id",
});

export default mongoose.model("Hotel", hotelSchema);
