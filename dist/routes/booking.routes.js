"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _booking = require("../controllers/booking.controller");

var _auth = require("../controllers/auth.controller");

var router = _express["default"].Router({
  mergeParams: true
});

router.route("/bookings").post(_booking.getAllBookings, (0, _auth.restrictTo)("user", "admin"), _booking.getAllBookings).post(_auth.protect, (0, _auth.restrictTo)("user"), _booking.createBooking);
router.route("/:booking-id").post(_auth.protect, (0, _auth.restrictTo)("admin"), _booking.getBooking).patch(_auth.protect, (0, _auth.restrictTo)("admin"), _booking.updateBooking)["delete"](_auth.protect, (0, _auth.restrictTo)("admin"), _booking.deleteBooking);
var _default = router;
exports["default"] = _default;