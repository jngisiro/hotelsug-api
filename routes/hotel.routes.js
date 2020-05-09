const express = require("express");

const router = express.Router();

const hotelController = require("../controllers/hotel.controller");

router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(hotelController.createHotel);

router
  .route("/within-radius/:distance/center/:pin/unit/:unit")
  .get(hotelController.getCloseProperty);

router.route("/distances/:pin/unit/:unit").get(hotelController.getDistances);

router
  .route("/:id")
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);

module.exports = router;
