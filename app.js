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
// Routers
//security packages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
//security packages

//setting http headers
// app.use(helmet());

//dev environment logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// rate limiting logic
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "You Achive The Maximum Limit Of Requests Please Try Again After 1 Hour",
});
// app.use("/api", limiter);

//Data Sanitization against Nosql Query injection
// app.use(mongoSanitize());

// Data Sanitization against xss attacks
// app.use(xss());

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

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//using the template enigine (PUG)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// main routes
app.get("/", (req, res) => {
  res.status(200).render("base", {
    tour: "The Arabic Shine",
    user: {
      name: "jonas",
    },
  });
});
app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", usersRouter);

app.use("/api/v1/reviews", reviewsRouter);

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
