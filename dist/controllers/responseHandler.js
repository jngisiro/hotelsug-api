"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/app-error");

var features = require("../utils/features");

exports.deleteOne = function (Model, document) {
  return catchAsync( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
      var doc;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Model.findByIdAndDelete(req.params.id);

            case 2:
              doc = _context.sent;

              if (doc) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", next(new AppError("No ".concat(document, " found with ID: ").concat(req.params.id), 404)));

            case 5:
              res.status(204).json({
                status: "Success",
                data: null
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
};

exports.updateOne = function (Model, document) {
  return catchAsync( /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
      var doc;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return Model.findByIdAndUpdate(req.params.id, req.body, {
                "new": true,
                runValidators: true
              });

            case 2:
              doc = _context2.sent;

              if (doc) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt("return", next(new AppError("No ".concat(document, " found with ID: ").concat(req.params.id), 404)));

            case 5:
              res.status(200).json({
                status: "Success",
                data: {
                  document: doc
                }
              });

            case 6:
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
};

exports.createOne = function (Model, document) {
  return catchAsync( /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
      var doc;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Model.create(req.body);

            case 2:
              doc = _context3.sent;
              res.status(201).json({
                status: "Success",
                message: "".concat(document, " created"),
                data: doc
              });

            case 4:
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
};

exports.getOne = function (Model, document) {
  return catchAsync( /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
      var doc;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return Model.findById(req.params.id);

            case 2:
              doc = _context4.sent;

              if (doc) {
                _context4.next = 5;
                break;
              }

              return _context4.abrupt("return", next(new AppError("No ".concat(document, " found with ID: ").concat(req.params.id), 404)));

            case 5:
              res.status(200).json({
                status: "Success",
                data: doc
              });

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  }());
};

exports.getAll = function (Model) {
  return catchAsync( /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
      var filter, queryObj, excludeFields, query, fields, page, limit, skip, doc;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Filter object to catch any userid params and send only transactions for that user
              filter = {};

              if (!req.params.userid) {
                _context5.next = 6;
                break;
              }

              console.log(req.params.userid);
              filter = {
                $or: [{
                  sender: req.user.id
                }, {
                  receiver: req.user.id
                }]
              };
              _context5.next = 8;
              break;

            case 6:
              if (!(req.user.role !== "superadmin")) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt("return", next(new AppError("You do not have the permissions to access this route", 403)));

            case 8:
              // Save the query parameters in an object
              queryObj = _objectSpread({}, req.query); // Exclude some fields from the query

              excludeFields = ["page", "limit", "sort", "fields"];
              excludeFields.forEach(function (el) {
                return delete queryObj[el];
              }); // add the "$" operator on the gte, gt, lte and lt keys

              queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
                return "$".concat(match);
              }));
              filter = _objectSpread(_objectSpread({}, filter), queryObj);
              query = Model.find(filter); // Sorting returned values by specified value in the req query or by default if no specified value

              if (req.query.sort) query.sort(req.query.sort);else query.sort("-createdAt"); // Limiting fields

              if (req.query.fields) {
                fields = req.query.fields.split(",").join(" ");
                query.select(fields);
              } else {
                query.select("-__v");
              } // Pagination


              page = req.query.page * 1 || 1;
              limit = req.query.limit * 1 || 10;
              skip = (page - 1) * limit;
              query.skip(skip).limit(limit);
              _context5.next = 22;
              return query;

            case 22:
              doc = _context5.sent;
              res.status(200).json({
                status: "Success",
                results: doc.length,
                data: doc
              });

            case 24:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x13, _x14, _x15) {
      return _ref5.apply(this, arguments);
    };
  }());
};