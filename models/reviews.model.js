const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "Review cannot be empty"] },
    rating: { type: Number, max: 5, min: 1 },
    createdAt: { type: Date, default: Date.now },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "Review must have a hotel"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hotel",
    select: "name",
  }).populate({
    path: "user",
    select: "firstname lastname",
  });

  next();
});

module.exports = mongoose.model("Review", ReviewSchema);
