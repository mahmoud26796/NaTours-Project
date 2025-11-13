const morgan = require("morgan"),
  express = require("express"),
  AppError = require("./utils/appError"),
  errorHandler = require("./Controllers/errorController"),
  path = require("path");
// Routers
// tours routes
const tourRouter = require("./routes/toursRouter");
//users routes
const usersRouter = require("./routes/usersRouters");
//Reviews Router
const reviewsRouter = require("./routes/reviewsRouter");
//Views Router
const viewsRouter = require("./routes/viewsRouter");
//bookings router
const bookingsRouter = require("./routes/bookingRouter");
// Routers
//security packages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
//security packages

// security-related HTTP headers
app.use(helmet());

//dev environment logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// rate limiting logic to prevent the same ip from making to many requests
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "You Achive The Maximum Limit Of Requests Please Try Again After 1 Hour",
});
app.use("/api", limiter);

// preventing params pollution
app.use(
  hpp({
    whiteList: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(cookieParser());
// body parser
app.use(express.json({ limit: "10kb" }));
//Data Sanitization against Nosql Query injection
// app.use(mongoSanitize());

// Data Sanitization against xss attacks
app.use(xss());

//handiling static files
app.use(express.static(`${__dirname}/public`));

//using the template enigine (PUG)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// main routes

app.use("/", viewsRouter);

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", usersRouter);

app.use("/api/v1/reviews", reviewsRouter);

app.use("/api/v1/bookings", bookingsRouter);

app.all("/api/v1{/*path}", (req, res, next) => {
  // const error = new Error(`Can't Find The Requested URL ${req.originalUrl} on this Server`);
  // error.status = 'Fail';
  // error.statusCode = 404;

  next(
    new AppError(
      `Can't Find The Requested URL ${req.originalUrl} on this Server`,
      404
    )
  );
});

app.use(errorHandler);
module.exports = app;
