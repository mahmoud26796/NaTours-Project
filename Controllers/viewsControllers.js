const Review = require("../models/reviewsModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

exports.renderRoot = catchAsync(async (req, res) => {
  res.status(200).render("base");
});

exports.renderAllTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", { tours });
});

exports.renderTour = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const tour = await Tour.findById({ _id });
  res.status(200).render("tour", { tour });
});
