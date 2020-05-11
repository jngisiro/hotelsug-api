"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var viewSchema = _mongoose["default"].Schema({
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