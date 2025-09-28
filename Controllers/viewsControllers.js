const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.renderRoot = catchAsync(async (req, res) => {
  res.status(200).render("base");
});

exports.renderAllTours = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", { tours });
});

exports.renderTour = (req, res) => {
  res.status(200).render("tour", {
    tour: {
      name: "The Arabic Shine",
    },
  });
};
