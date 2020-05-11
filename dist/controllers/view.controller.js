"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateView = exports.deleteView = exports.createView = exports.getView = exports.getAllViews = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _view = _interopRequireDefault(require("../models/view.model"));

var _catchAsync = _interopRequireDefault(require("../utils/catchAsync"));

var _appError = _interopRequireDefault(require("../utils/app-error"));

var getAllViews = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var filters, views;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filters = {};
            if (req.params.hotelId) filters = {
              hotel: req.params.hotelId
            };
            _context.next = 4;
            return _view["default"].find(filters);

          case 4:
            views = _context.sent;
            res.status(200).json({
              status: "success",
              data: {
                views: views
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
exports.getAllViews = getAllViews;
var getView = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var view;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _view["default"].findById(req.params.id);

          case 2:
            view = _context2.sent;
            res.status(200).json({
              status: "success",
              data: {
                view: view
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
exports.getView = getView;
var createView = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var view;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _view["default"].create(req.body);

          case 2:
            view = _context3.sent;
            res.status(201).json({
              status: "success",
              data: {
                view: view
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
exports.createView = createView;
var deleteView = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var view;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _view["default"].findByIdAndDelete(req.params.id);

          case 2:
            view = _context4.sent;

            if (view) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", next(new _appError["default"]("No view found with ID: ".concat(req.params.id), 404)));

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
exports.deleteView = deleteView;
var updateView = (0, _catchAsync["default"])( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var view;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _view["default"].findByIdAndUpdate(req.params.id, req.body, {
              "new": true,
              runValidators: true
            });

          case 2:
            view = _context5.sent;

            if (view) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return", next(new _appError["default"]("No view found with ID: ".concat(req.params.id), 404)));

          case 5:
            res.status(200).json({
              status: "Success",
              data: {
                view: view
              }
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x10, _x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());
exports.updateView = updateView;