const express = require("express");

const router = express.Router();

const {
  getAllReviews,
  addReview,
} = require("../Controllers/reviewsController");

router.route("/").get(getAllReviews).post(addReview);

module.exports = router;
