"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var catchAsync = require("../utils/catchAsync"); // Error Handling wrapper for aysnc operations


var AppError = require("../utils/app-error"); // Custom Error Handling Class


var User = require("../models/user.model");

var resHandler = require("./responseHandler");

var filterRequestBody = function filterRequestBody(inputData) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var fields = {};
  Object.keys(inputData).forEach(function (el) {
    if (allowedFields.includes(el)) fields[el] = inputData[el];
  });
  return fields;
};

exports.getAllUsers = resHandler.getAll(User);
exports.getUser = resHandler.getOne(User, "User");

exports.me = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.updateUser = resHandler.updateOne(User, "User");
exports.deleteUser = resHandler.deleteOne(User, "User");
exports.createUser = catchAsync( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            next(new AppError("This route is not defined! Please use the users/signup route"));

          case 1:
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
exports.updateMe = catchAsync( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var filteredData, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(req.body.password || req.body.passwordConfirm)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", next(new AppError("Cannot update password from theis route. Use /updatePassword", 400)));

          case 2:
            // filter unwanted data from the request object
            filteredData = filterRequestBody(req.body, "firstname", "lastname"); // Update User document

            _context2.next = 5;
            return User.findByIdAndUpdate(req.user.id, _objectSpread({}, filteredData), {
              "new": true,
              runValidators: true
            });

          case 5:
            user = _context2.sent;
            res.status(200).json({
              status: "success",
              data: {
                user: user
              }
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
exports.deleteMe = catchAsync( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return User.findByIdAndUpdate(req.user.id, {
              active: false
            });

          case 2:
            res.status(204).json({
              status: "success",
              data: null
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());