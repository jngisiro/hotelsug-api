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
} from "../controllers/hotel.controller";
import { getMonthlyPlan } from "../controllers/analytics.controller";

import reviewRouter from "./review.routes";
import viewsRouter from "./views.routes";
import bookingRouter from "./booking.routes";

const router = express.Router();

router.use("/:hotelId/review", reviewRouter);
router.use("/:hotelId/views", viewsRouter);
router.use("/:hotelId/bookings", bookingRouter);

router.route("/").get(getAllHotels).post(createHotel);

router.route("/top-5-cheap").get(topFiveHotels, getAllHotels);
router.route("/analytics").get(getHotelAnalytics);
router.route("monthly-plan/:year").get(getMonthlyPlan);

router
  .route("/within-radius/:distance/center/:pin/unit/:unit")
  .get(getCloseProperty);

router.route("/distances/:pin/unit/:unit").get(getDistances);

router.route("/:id").get(getHotel).patch(updateHotel).delete(deleteHotel);

export default router;
