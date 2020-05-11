"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _favourite = require("../controllers/favourite.controller");

var _auth = require("../controllers/auth.controller");

var router = _express["default"].Router({
  mergeParams: true
});

router.route("/favourites").post(_auth.protect, (0, _auth.restrictTo)("user", "admin"), _favourite.getAllFavourites);
var _default = router;
exports["default"] = _default;