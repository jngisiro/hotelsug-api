import express from "express";

import {
  getAllHotels,
  createHotel,
  getCloseProperty,
  getDistances,
  getHotel,
  updateHotel,
  deleteHotel,
  topFiveHotels,
  getHotelAnalytics,
  me,
} from "../controllers/hotel.controller";
import { getMonthlyPlan } from "../controllers/analytics.controller";
import upload from "../utils/upload";

import reviewRouter from "./review.routes";
import viewsRouter from "./views.routes";
import bookingRouter from "./booking.routes";
import favouritesRouter from "./favourites.routes";
import {
  protect,
  restrictTo,
  login,
  logout,
  signup,
} from "../controllers/hotelAuth.controllers";

const router = express.Router();

router.use("/:hotelId/review", reviewRouter);
router.use("/:hotelId/views", viewsRouter);
router.use("/:hotelId/bookings", bookingRouter);
router.use("/:hotelId/favourites", favouritesRouter);

router.route("/").get(getAllHotels).post(createHotel);

router.route("/top-5-cheap").get(topFiveHotels, getAllHotels);
router.route("/me").get(me);
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").post(logout);

router.route("/analytics").get(getHotelAnalytics);
router.route("monthly-plan/:year").get(getMonthlyPlan);
router.route("/upload-hotel-image").get(upload);

router
  .route("/within-radius/:distance/center/:pin/unit/:unit")
  .get(getCloseProperty);

router.route("/distances/:pin/unit/:unit").get(getDistances);

router.route("/:id").get(getHotel).patch(updateHotel).delete(deleteHotel);

export default router;
