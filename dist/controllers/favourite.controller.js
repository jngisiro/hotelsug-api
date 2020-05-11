"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFavourite = exports.createFavourite = exports.getFavourite = exports.getAllFavourites = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _favourites = _interopRequireDefault(require("../models/favourites.model"));

var _catchAsync = _interopRequireDefault(require("../utils/catchAsync"));

var _appError = _interopRequireDefault(require("../utils/app-error"));

var getAllFavourites = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var filters, favourites;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filters = {};
            if (req.params.hotelId) filters = {
              hotel: req.params.hotelId
            };
            _context.next = 4;
            return _favourites["default"].find(filters);

          case 4:
            favourites = _context.sent;
            res.status(200).json({
              status: "success",
              data: {
                favourites: favourites
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
exports.getAllFavourites = getAllFavourites;
var getFavourite = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var favourite;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _favourites["default"].findById(req.params.id);

          case 2:
            favourite = _context2.sent;
            res.status(200).json({
              status: "success",
              data: {
                favourite: favourite
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
exports.getFavourite = getFavourite;
var createFavourite = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var favourite;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _favourites["default"].create(req.body);

          case 2:
            favourite = _context3.sent;
            res.status(201).json({
              status: "success",
              data: {
                favourite: favourite
              }
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
exports.createFavourite = createFavourite;
var deleteFavourite = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var favourite;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _favourites["default"].findByIdAndDelete(req.params.id);

          case 2:
            favourite = _context4.sent;

            if (favourite) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", next(new _appError["default"]("No favourite found with ID: ".concat(req.params.id), 404)));

          case 5:
            res.status(204).json({
              status: "Success",
              data: null
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());
exports.deleteFavourite = deleteFavourite;