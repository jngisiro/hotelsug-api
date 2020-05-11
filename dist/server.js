"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("./app"));

// Saftety net handle unexpected programming errors
process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION!");
  console.log(err.name, err.stack); // process.exit(1);
});
if (process.env.NODE_ENV === "test") _dotenv["default"].config({
  path: "./testing.config.env"
});else _dotenv["default"].config({
  path: "./config.env"
}); //const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

var DB = process.env.DATABASE;

_mongoose["default"].connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(function (con) {
  return console.log("Successful Database Connection");
})["catch"](function (err) {
  return console.log(err);
});

var PORT = process.env.PORT || 8000;

var server = _app["default"].listen(PORT, function () {
  console.log("Running in ".concat(process.env.NODE_ENV, " mode\nListening on port ").concat(process.env.PORT));
});

process.on("unhandledRejection", function (err) {
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message); // server.close(() => {
  //   process.exit(1);
  // });
});
module.exports = server;