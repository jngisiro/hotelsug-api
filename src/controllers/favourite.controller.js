import Favourite from "../models/favs.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/app-error";

export const getAllFavourites = catchAsync(async (req, res) => {
  let filters = {};

  if (req.params.hotelId) filters = { hotel: req.params.hotelId };

  const favourites = await Favourite.find(filters);

  res.status(200).json({
    status: "success",
    data: {
      favourites,
    },
  });
});

export const getFavourite = catchAsync(async (req, res) => {
  const favourite = await Favourite.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      favourite,
    },
  });
});

export const createFavourite = catchAsync(async (req, res) => {
  const favourite = await Favourite.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      favourite,
    },
  });
});

export const deleteFavourite = catchAsync(async (req, res, next) => {
  const favourite = await Favourite.findByIdAndDelete(req.params.id);

  if (!favourite)
    return next(
      new AppError(`No favourite found with ID: ${req.params.id}`, 404)
    );

  res.status(204).json({
    status: "Success",
    data: null,
  });
});
