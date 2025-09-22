const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  addReview,
} = require("../Controllers/reviewsController");
const { protect, restrictTo } = require("../Controllers/authControllers");
router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), addReview);

module.exports = router;
