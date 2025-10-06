const Review = require("../models/reviewsModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");

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
  res.status(200).render("tour", { tour });
});
