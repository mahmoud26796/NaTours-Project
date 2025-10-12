const Review = require("../models/reviewsModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.renderLoginPage = catchAsync(async (req, res) => {
  res.status(200).render("login");
});

exports.renderAllTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", { tours });
});

exports.renderTour = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug });
  if (!tour) {
    return next(new AppError("No Tour With That Name Found", 404));
  }
  res.status(200).render("tour", { tour });
});

exports.renderAccountPage = catchAsync(async (req, res) => {
  // const user = await User.findById();
  res.status(200).render("account");
});
