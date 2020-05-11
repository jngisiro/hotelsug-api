"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHotelAnalytics = exports.getDistances = exports.getCloseProperty = exports.createHotel = exports.deleteHotel = exports.updateHotel = exports.getHotel = exports.getAllHotels = exports.topFiveHotels = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _catchAsync = _interopRequireDefault(require("../utils/catchAsync"));

var _hotel = _interopRequireDefault(require("../models/hotel.model"));

var _responseHandler = _interopRequireDefault(require("./responseHandler"));

var _appError = _interopRequireDefault(require("../utils/app-error"));

var _features = _interopRequireDefault(require("../utils/features"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// import upload from "./../utils/upload";
// TODO Delete this after refactoring
var document = "hotel";

var topFiveHotels = function topFiveHotels(req, res, next) {
  req.query.limit = "5";
  req.query.sort = "-rating,price";
  req.query.fields = "name,price,rating,summary,location[address]";
  next();
};

exports.topFiveHotels = topFiveHotels;
var getAllHotels = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var features, doc;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.cookies);
            features = new _features["default"](_hotel["default"].find(), req.query).filter().sort().project().paginate();
            _context.next = 4;
            return features.query;

          case 4:
            doc = _context.sent;
            res.status(200).json({
              status: "Success",
              results: doc.length,
              data: doc
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
exports.getAllHotels = getAllHotels;
var getHotel = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var hotel;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _hotel["default"].findById(req.params.id).populate("reviews").populate("bookings").populate("favourites").populate("views");

          case 2:
            hotel = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              status: "sucess",
              data: {
                hotel: hotel
              }
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
exports.getHotel = getHotel;

var updateHotel = _responseHandler["default"].updateOne(_hotel["default"], document);

exports.updateHotel = updateHotel;

var deleteHotel = _responseHandler["default"].deleteOne(_hotel["default"], document);

exports.deleteHotel = deleteHotel;
var createHotel = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var newHotel;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.file) req.body.coverImage = req.file.filename;
            _context3.next = 3;
            return _hotel["default"].create(_objectSpread({}, req.body));

          case 3:
            newHotel = _context3.sent;
            res.status(201).json({
              status: "Success",
              hotel: newHotel
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}()); // Get all Hotels that are within a given radius from a defined point

exports.createHotel = createHotel;
var getCloseProperty = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var _req$params, distance, pin, unit, _pin$split, _pin$split2, lat, _long, radius, hotel;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params = req.params, distance = _req$params.distance, pin = _req$params.pin, unit = _req$params.unit;
            _pin$split = pin.split(","), _pin$split2 = (0, _slicedToArray2["default"])(_pin$split, 2), lat = _pin$split2[0], _long = _pin$split2[1];
            radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
            if (!lat || !_long) next(new _appError["default"]("Please provide your co-ordinates in the format lat,lng", 500));
            _context4.next = 6;
            return _hotel["default"].find({
              location: {
                $geoWithin: {
                  $centerSphere: [[_long, lat], radius]
                }
              }
            });

          case 6:
            hotel = _context4.sent;
            res.status(200).json({
              status: "Success",
              results: hotel.length,
              data: hotel
            });

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}()); // Get the distances of all hotels from a defined point

exports.getCloseProperty = getCloseProperty;
var getDistances = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var _req$params2, pin, unit, _pin$split3, _pin$split4, lat, _long2, distances;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params2 = req.params, pin = _req$params2.pin, unit = _req$params2.unit;
            _pin$split3 = pin.split(","), _pin$split4 = (0, _slicedToArray2["default"])(_pin$split3, 2), lat = _pin$split4[0], _long2 = _pin$split4[1];
            if (!lat || !_long2) next(new _appError["default"]("Please provide your co-ordinates in the format lat,lng", 500));
            _context5.next = 5;
            return _hotel["default"].aggregate([{
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [_long2 * 1, lat * 1]
                },
                distanceField: "distance"
              }
            }]);

          case 5:
            distances = _context5.sent;
            res.status(200).json({
              status: "Success",
              data: distances
            });

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}());
exports.getDistances = getDistances;
var getHotelAnalytics = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var analytics;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _hotel["default"].aggregate([{
              $match: {
                rating: {
                  $gte: 4.5
                }
              }
            }, {
              $group: {
                _id: null,
                avgrating: {
                  $avg: "rating"
                },
                avgPrice: {
                  $avg: "price"
                },
                maxPrice: {
                  $max: "price"
                },
                minPrice: {
                  $min: "price"
                }
              }
            }]);

          case 2:
            analytics = _context6.sent;
            res.status(200).json({
              status: "success",
              data: {
                analytics: analytics
              }
            });

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}());
exports.getHotelAnalytics = getHotelAnalytics;