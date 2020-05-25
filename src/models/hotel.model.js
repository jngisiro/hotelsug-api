import mongoose from "mongoose";
import slugify from "slugify";

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

    images: { type: [String] },

    coverImage: { type: String },

    description: {
      type: String,
      trim: true,
      required: [true, "Provide the Hotel description"],
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "Provide the Hotel summary"],
    },

    facilities: {
      type: [String],
      trim: true,
    },

    languages: [String],

    availability: Boolean,

    active: false,

    price: {
      avgPrice: Number,
      deluxe: Number,
      Suite: Number,
      Ordinary: Number,
    },

    rating: Number, // The average rating

    ratings: Number, // Number of ratings

    supportedPayments: {
      type: [String],
      default: ["Mobile Money"],
    },

    rules: [String],

    address: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: {
        type: String,
        trim: true,
        required: [true, "Provide the Hotel location"],
      },
      description: {
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

hotelSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

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
