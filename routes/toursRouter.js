const express = require("express");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();
// Controllers
const {
  uploadTourPictures,
  getAllTours,
  getTourByID,
  addNewTour,
  updateTour,
  removeTour,
  getToursStats,
  getMonthlyPlan,
  gettoursWithin,
} = require("../Controllers/toursControllers");
const { protect, restrictTo } = require("../Controllers/authControllers");

const { addReview } = require("../Controllers/reviewsController");
// Controllers

// merged params logic
router.use("/:tourId/reviews", reviewsRouter);
// tours routes
router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/")
  .get(protect, getAllTours)
  .post(uploadTourPictures, addNewTour)
  .post(protect, restrictTo("user"), addReview);
router
  .route("/tours-within/:distance/center/:lating/unit/:unit")
  .get(gettoursWithin);
router.use(protect, restrictTo("admin", "lead-guide"));
router
  .route("/:id")
  .get(getTourByID)
  .patch(uploadTourPictures, updateTour)
  .delete(removeTour);
module.exports = router;
