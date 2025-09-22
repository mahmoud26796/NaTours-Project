const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Review = require("../models/reviewsModel");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const filterRevsForTour = {};
  if (req.params.tourId) filterRevsForTour["tour"] = req.params.tourId;
  console.log(filterRevsForTour);

  const reviews = await Review.find(filterRevsForTour);
  if (!reviews) {
    next(new AppError("This page Not Found", 404));
  }
  res.status(200).json({
    status: "Success",
    length: reviews.length,
    reviews,
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "Sucess",
    message: "Review Added",
    data: [newReview],
  });
});
