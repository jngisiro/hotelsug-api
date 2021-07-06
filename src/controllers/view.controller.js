import View from "../models/view.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/app-error";

export const getAllViews = catchAsync(async (req, res) => {
  let filters = {};

  if (req.params.hotelId) filters = { hotel: req.params.hotelId };

  const views = await View.find(filters);

  res.status(200).json({
    status: "success",
    data: {
      views,
    },
  });
});

export const getView = catchAsync(async (req, res) => {
  const view = await View.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      view,
    },
  });
});

export const createView = catchAsync(async (req, res) => {
  const view = await View.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      view,
    },
  });
});

export const deleteView = catchAsync(async (req, res, next) => {
  const view = await View.findByIdAndDelete(req.params.id);

  if (!view)
    return next(new AppError(`No view found with ID: ${req.params.id}`, 404));

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

export const updateView = catchAsync(async (req, res, next) => {
  const view = await View.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!view)
    return next(new AppError(`No view found with ID: ${req.params.id}`, 404));

  res.status(200).json({
    status: "Success",
    data: {
      view,
    },
  });
});
