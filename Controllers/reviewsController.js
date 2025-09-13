const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Review = require("../models/reviewsModel");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({});
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
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "Sucess",
    message: "Review Added",
    newReview,
  });
});
