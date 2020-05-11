"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _hotel = require("../controllers/hotel.controller");

var _analytics = require("../controllers/analytics.controller");

var _review = _interopRequireDefault(require("./review.routes"));

var _views = _interopRequireDefault(require("./views.routes"));

var _booking = _interopRequireDefault(require("./booking.routes"));

var router = _express["default"].Router();

router.use("/:hotelId/review", _review["default"]);
router.use("/:hotelId/views", _views["default"]);
router.use("/:hotelId/bookings", _booking["default"]);
router.route("/").get(_hotel.getAllHotels).post(_hotel.createHotel);
router.route("/top-5-cheap").get(_hotel.topFiveHotels, _hotel.getAllHotels);
router.route("/analytics").get(_hotel.getHotelAnalytics);
router.route("monthly-plan/:year").get(_analytics.getMonthlyPlan);
router.route("/within-radius/:distance/center/:pin/unit/:unit").get(_hotel.getCloseProperty);
router.route("/distances/:pin/unit/:unit").get(_hotel.getDistances);
router.route("/:id").get(_hotel.getHotel).patch(_hotel.updateHotel)["delete"](_hotel.deleteHotel);
var _default = router;
exports["default"] = _default;