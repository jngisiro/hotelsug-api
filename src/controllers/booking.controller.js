import Bookings from "../models/booking.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/app-error";

export const getAllBookings = catchAsync(async (req, res) => {
  let filters = {};

  if (req.params.hotelId) filters = { hotel: req.params.hotelId };

  const bookings = await Bookings.find(filters);

  res.status(200).json({
    status: "success",
    data: {
      bookings,
    },
  });
});

export const getBooking = catchAsync(async (req, res) => {
  const booking = await Bookings.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});

export const createBooking = catchAsync(async (req, res) => {
  const booking = await Bookings.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      booking,
    },
  });
});

export const deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Bookings.findByIdAndDelete(req.params.id);

  if (!booking)
    return next(
      new AppError(`No booking found with ID: ${req.params.id}`, 404)
    );

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

export const updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Bookings.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!booking)
    return next(new AppError(`No view found with ID: ${req.params.id}`, 404));

  res.status(200).json({
    status: "Success",
    data: {
      booking,
    },
  });
});
