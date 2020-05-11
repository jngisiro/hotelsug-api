"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _location = require("../controllers/location.controller");

var _auth = require("../controllers/auth.controller");

var router = _express["default"].Router();

router.route("/").get(_location.getAllLocations).post(_auth.protect, (0, _auth.restrictTo)("admin"), _location.createLocation);
router.route("/:id").get(_location.getLocation).patch(_auth.protect, (0, _auth.restrictTo)("admin"), _location.updateLocation)["delete"](_auth.protect, (0, _auth.restrictTo)("admin"), _location.deleteLocation);
var _default = router;
exports["default"] = _default;