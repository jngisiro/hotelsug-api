import Location from "../models/location.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/app-error";

export const getAllLocations = catchAsync(async (req, res) => {
  const locations = await Location.find().populate("hotels");

  res.status(200).json({
    status: "success",
    data: {
      locations,
    },
  });
});

export const getLocation = catchAsync(async (req, res) => {
  const location = await Location.findById(req.params.id).populate("hotels");

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

export const createLocation = catchAsync(async (req, res) => {
  const location = await Location.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      location,
    },
  });
});

export const deleteLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndDelete(req.params.id);

  if (!location)
    return next(
      new AppError(`No location found with ID: ${req.params.id}`, 404)
    );

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

export const updateLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!location)
    return next(
      new AppError(`No location found with ID: ${req.params.id}`, 404)
    );

  res.status(200).json({
    status: "Success",
    data: {
      location,
    },
  });
});
