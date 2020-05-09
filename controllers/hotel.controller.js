const catchAsync = require("../utils/catchAsync");
const Hotel = require("../models/hotel.model");
const resHandler = require("./responseHandler");
const AppError = require("../utils/app-error");
const upload = require("./../utils/upload");

// TODO Delete this after refactoring
const document = "hotel";

exports.getAllHotels = catchAsync(async (req, res, next) => {
  // Filter object to catch any userid params and send only transactions for that user
  let filter = {};
  console.log(req.cookies);
  // Save the query parameters in an object
  let queryObj = { ...req.query };

  // Exclude some fields from the query
  const excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // add the "$" operator on the gte, gt, lte and lt keys
  queryObj = JSON.parse(
    JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    )
  );

  filter = { ...filter, ...queryObj };

  const query = Hotel.find(filter);

  // Sorting returned values by specified value in the req query or by default if no specified value
  if (req.query.sort) query.sort(req.query.sort);
  else query.sort("-createdAt");

  // Limiting fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query.select(fields);
  } else {
    query.select("-__v");
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query.skip(skip).limit(limit);

  const doc = await query;

  res.status(200).json({
    status: "Success",
    results: doc.length,
    data: doc,
  });
});

exports.getHotel = resHandler.getOne(Hotel, document);

exports.updateHotel = resHandler.updateOne(Hotel, document);

exports.deleteHotel = resHandler.deleteOne(Hotel, document);

exports.createHotel = catchAsync(async (req, res, next) => {
  if (req.file) req.body.coverImage = req.file.filename;

  const newHotel = await Hotel.create({
    ...req.body,
  });

  res.status(201).json({
    status: "Success",
    hotel: newHotel,
  });
});

// Get all property that are within a given radius from a defined point
exports.getCloseProperty = catchAsync(async (req, res, next) => {
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

  const property = await Property.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    status: "Success",
    results: stations.length,
    data: property,
  });
});

// Get the distances of all property from a defined point
exports.getDistances = catchAsync(async (req, res, next) => {
  const { pin, unit } = req.params;
  const [lat, long] = pin.split(",");

  if (!lat || !long)
    next(
      new AppError(
        "Please provide your co-ordinates in the format lat,lng",
        500
      )
    );

  const distances = await Property.aggregate([
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
