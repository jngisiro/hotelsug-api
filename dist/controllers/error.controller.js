"use strict";

var AppError = require("../utils/app-error");

var sendDevError = function sendDevError(err, res) {
  // In Development mode send full error description
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

var sendProdError = function sendProdError(err, res) {
  // In Production mode send only operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err.message
    });
  } else {
    // Log Error
    console.log("UNEXPECTED ERROR: ", err); // Send a generic error message if the error is unexpected or is a programming error

    res.status(500).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};

var handleCastErrorDB = function handleCastErrorDB(err) {
  var message = "Invalid ".concat(err.path, ": ").concat(err.value);
  return new AppError(message, 400);
};

var handleDuplicateFieldsDB = function handleDuplicateFieldsDB(err) {
  var value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  var message = "Duplicate field value: ".concat(value[0], ". Please use another value");
  return new AppError(message, 400);
};

var handleValidationErrorDB = function handleValidationErrorDB(err) {
  var errors = Object.values(err.errors).map(function (el) {
    return el.message;
  });
  var messsage = "Invalid input data: ".concat(errors.join(". "));
  return new AppError(messsage, 400);
};

var handleJWTError = function handleJWTError() {
  return new AppError("Invalid Token. Please login again", 401);
};

var handleJWTExpiryError = function handleJWTExpiryError() {
  return new AppError("Token has expired. Please login again", 401);
};

module.exports = function (err, req, res, next) {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500; // Send different errors to clients depending on the program is development or production mode

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    var error = err; // { ...err }

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiryError();
    sendProdError(error, res);
  }
};