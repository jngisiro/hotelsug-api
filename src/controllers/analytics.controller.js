import catchAsync from "../utils/catchAsync";
import Hotel from "../models/hotel.model";

export const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const plan = await Hotel.aggregate([
    {
      $unwind: "$createdAt",
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
