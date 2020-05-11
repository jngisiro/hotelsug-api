"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var favouriteSchema = _mongoose["default"].Schema({
  createdAt: {
    type: Date,
    "default": Date.now()
  },
  hotel: {
    type: _mongoose["default"].Schema.ObjectId,
    ref: "Hotel"
  },
  user: {
    type: _mongoose["default"].Schema.ObjectId,
    ref: "User"
  }
});

var _default = _mongoose["default"].model("Favourite", favouriteSchema);

exports["default"] = _default;