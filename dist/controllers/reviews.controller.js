"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReview = exports.getAllReviews = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reviews = _interopRequireDefault(require("../models/reviews.model"));

var _catchAsync = _interopRequireDefault(require("../utils/catchAsync"));

var getAllReviews = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var filters, reviews;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filters = {};
            if (req.params.hotelId) filters = {
              hotel: req.params.hotelId
            };
            _context.next = 4;
            return _reviews["default"].find(filters);

          case 4:
            reviews = _context.sent;
            res.status(200).json({
              status: "success",
              result: reviews.length,
              data: {
                reviews: reviews
              }
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
exports.getAllReviews = getAllReviews;
var createReview = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var newReview;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _reviews["default"].create(req.body);

          case 2:
            newReview = _context2.sent;
            res.status(201).json({
              status: "success",
              data: {
                newReview: newReview
              }
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
exports.createReview = createReview;