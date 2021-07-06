import Review from "../models/reviews.model";
import catchAsync from "../utils/catchAsync";

export const getAllReviews = catchAsync(async (req, res) => {
  let filters = {};

  if (req.params.hotelId) filters = { hotel: req.params.hotelId };

  const reviews = await Review.find(filters);
  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: { reviews },
  });
});

export const createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newReview },
  });
});
