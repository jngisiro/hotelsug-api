import catchAsync from "../utils/catchAsync";
import Hotel from "../models/hotel.model";
import resHandler from "./responseHandler";
import AppError from "../utils/app-error";
import Features from "../utils/features";
// import upload from "./../utils/upload";

// TODO Delete this after refactoring
const document = "hotel";

export const topFiveHotels = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-rating,price";
  req.query.fields = "name,price,rating,summary,location[address]";
  next();
};

export const getAllHotels = catchAsync(async (req, res, next) => {
  const features = new Features(Hotel.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();
  const doc = await features.query;

  res.status(200).json({
    status: "Success",
    results: doc.length,
    data: doc,
  });
});

export const getHotel = catchAsync(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate("reviews")
    .populate("bookings")
    .populate("views")
    .populate("favs");

  return res.status(200).json({
    status: "sucess",
    data: {
      hotel,
    },
  });
});

export const updateHotel = resHandler.updateOne(Hotel, document);

export const deleteHotel = resHandler.deleteOne(Hotel, document);

export const createHotel = catchAsync(async (req, res, next) => {
  if (req.file) req.body.coverImage = req.file.filename;

  const newHotel = await Hotel.create({
    ...req.body,
  });

  res.status(201).json({
    status: "Success",
    hotel: newHotel,
  });
});

// Get all Hotels that are within a given radius from a defined point
export const getCloseProperty = catchAsync(async (req, res, next) => {
  const { distance, pin, unit } = req.params;
  const [lat, long] = pin.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !long)
    next(
      new AppError(
        "Please provide your co-ordinates in the format lat,lng",
        500
      )
    );

  const hotel = await Hotel.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    status: "Success",
    results: hotel.length,
    data: hotel,
  });
});

// Get the distances of all hotels from a defined point
export const getDistances = catchAsync(async (req, res, next) => {
  const { pin, unit } = req.params;
  const [lat, long] = pin.split(",");

  if (!lat || !long)
    next(
      new AppError(
        "Please provide your co-ordinates in the format lat,lng",
        500
      )
    );

  const distances = await Hotel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long * 1, lat * 1],
        },

        distanceField: "distance",
      },
    },
  ]);

  res.status(200).json({
    status: "Success",
    data: distances,
  });
});

export const getHotelAnalytics = catchAsync(async (req, res) => {
  const analytics = await Hotel.aggregate([
    {
      $match: { rating: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        avgrating: { $avg: "rating" },
        avgPrice: { $avg: "price" },
        maxPrice: { $max: "price" },
        minPrice: { $min: "price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      analytics,
    },
  });
});
