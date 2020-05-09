const Review = require("../models/reviews.model");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newReview },
  });
});
