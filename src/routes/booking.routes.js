import express from "express";

import {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller";

import { protect, restrictTo } from "../controllers/auth.controller";

const router = express.Router({ mergeParams: true });

router
  .route("/bookings")
  .post(getAllBookings, restrictTo("user", "admin"), getAllBookings)
  .post(protect, restrictTo("user"), createBooking);

router
  .route("/:booking-id")
  .post(protect, restrictTo("admin"), getBooking)
  .patch(protect, restrictTo("admin"), updateBooking)
  .delete(protect, restrictTo("admin"), deleteBooking);

export default router;
