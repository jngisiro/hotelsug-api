"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _expressMongoSanitize = _interopRequireDefault(require("express-mongo-sanitize"));

var _xssClean = _interopRequireDefault(require("xss-clean"));

var _hpp = _interopRequireDefault(require("hpp"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _user = _interopRequireDefault(require("./routes/user.routes"));

var _hotel = _interopRequireDefault(require("./routes/hotel.routes"));

var _review = _interopRequireDefault(require("./routes/review.routes"));

var _location = _interopRequireDefault(require("./routes/location.routes"));

var _appError = _interopRequireDefault(require("./utils/app-error"));

var _error = _interopRequireDefault(require("./controllers/error.controller"));

var app = (0, _express["default"])(); // handle rate limit with express-rate-limit

var limiter = (0, _expressRateLimit["default"])({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP"
});
app.use("/api", limiter); // configure helmet for securtiy headers

app.use((0, _helmet["default"])()); //  configure cors

app.use((0, _cors["default"])());
app.options("*", (0, _cors["default"])()); // Parse request data in the request body into json

app.use(_express["default"].json({
  limit: "10kb"
}));
app.use(_express["default"].urlencoded({
  extended: true
})); // Parse cookies from the request

app.use((0, _cookieParser["default"])()); // Data Sanitization from NoSQL injections

app.use((0, _expressMongoSanitize["default"])()); // Data Sanitization from XScripting attacks

app.use((0, _xssClean["default"])()); // Prevent Parameter Pollution

app.use((0, _hpp["default"])({
  whitelist: ["duration"]
})); // Serve static files in public folder

app.use(_express["default"]["static"]("public")); // Review Routes

app.use("/api/v1/reviews", _review["default"]); // Hotel Routes

app.use("/api/v1/hotel", _hotel["default"]); // User routes

app.use("/api/v1/users", _user["default"]); // Location Routes

app.use("/api/v1/locations", _location["default"]);
app.all("*", function (req, res, next) {
  next(new _appError["default"]("Can't find route: ".concat(req.originalUrl), 400));
}); // Error handling

app.use(_error["default"]);
var _default = app;
exports["default"] = _default;