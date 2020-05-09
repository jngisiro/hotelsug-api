const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const app = express();
const userRouter = require("./routes/user.routes");
const hotelRouter = require("./routes/hotel.routes");
const reviewRouter = require("./routes/review.routes");
const AppError = require("./utils/app-error");
const globalErrorHandler = require("./controllers/error.controller");

// handle rate limit with express-rate-limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP",
});
app.use("/api", limiter);

// configure helmet for securtiy headers
app.use(helmet());

//  configure cors
app.use(cors());
app.options("*", cors());

// Parse request data in the request body into json
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Parse cookies from the request
app.use(cookieParser());

// Data Sanitization from NoSQL injections
app.use(mongoSanitize());

// Data Sanitization from XScripting attacks
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp({ whitelist: ["duration"] }));

// Serve static files in public folder
app.use(express.static("public"));

// Review Routes
app.use("/api/v1/reviews", reviewRouter);

// Hotel Routes
app.use("/api/v1/hotel", hotelRouter);

// User routes
app.use("/api/v1/users", userRouter);

// Transaction Routes
// app.use("/api/v1/transactions", transactionRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find route: ${req.originalUrl}`, 400));
});

// Error handling
app.use(globalErrorHandler);

module.exports = app;
