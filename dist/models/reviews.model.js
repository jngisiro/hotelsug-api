"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var ReviewSchema = new _mongoose["default"].Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"]
  },
  rating: {
    type: Number,
    max: 5,
    min: 1
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  hotel: {
    type: _mongoose["default"].Schema.ObjectId,
    ref: "Hotel",
    required: [true, "Review must have a hotel"]
  },
  user: {
    type: _mongoose["default"].Schema.ObjectId,
    ref: "User",
    required: [true, "Review must have a user"]
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hotel",
    select: "name"
  }).populate({
    path: "user",
    select: "firstname lastname"
  });
  next();
});

var _default = _mongoose["default"].model("Review", ReviewSchema);

exports["default"] = _default;