"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Features = /*#__PURE__*/function () {
  function Features(query, queryString) {
    (0, _classCallCheck2["default"])(this, Features);
    this.query = query;
    this.queryString = queryString;
  }

  (0, _createClass2["default"])(Features, [{
    key: "filter",
    value: function filter() {
      // Save the query parameters in an object
      var queryObj = _objectSpread({}, this.queryString); // Exclude some fields from the query


      var excludeFields = ["page", "limit", "sort", "fields"];
      excludeFields.forEach(function (el) {
        return delete queryObj[el];
      }); // add the "$" operator on the gte, gt, lte and lt keys

      queryObj = JSON.parse(JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
        return "$".concat(match);
      }));
      this.query = this.query.find(queryObj);
      return this;
    }
  }, {
    key: "sort",
    value: function sort() {
      // Sorting returned values by specified value in the req query or by default if no specified value
      if (this.queryString.sort) {
        var sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query.sort("-createdAt");
      }

      return this;
    }
  }, {
    key: "project",
    value: function project() {
      // Limiting fields. Select only certain fields from the database (Projecting  )
      if (this.queryString.fields) {
        var fields = this.queryString.fields.split(",").join(" ");
        this.query.select(fields);
      } else {
        this.query.select("-__v");
      }

      return this;
    }
  }, {
    key: "paginate",
    value: function paginate() {
      // Pagination
      var page = this.queryString.page * 1 || 1;
      var limit = this.queryString.limit * 1 || 10;
      var skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
  }]);
  return Features;
}();

exports["default"] = Features;