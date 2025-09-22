const express = require("express");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();
// Controllers
const {
  getAllTours,
  getTourByID,
  addNewTour,
  updateTour,
  removeTour,
  getToursStats,
  getMonthlyPlan,
} = require("../Controllers/toursControllers");
const { protect, restrictTo } = require("../Controllers/authControllers");

const { addReview } = require("../Controllers/reviewsController");
// Controllers

// merged params logic
router.use("/:tourId/reviews", reviewsRouter);
// tours routes
router
  .route("/")
  .get(protect, getAllTours)
  .post(addNewTour)
  .post(protect, restrictTo("user"), addReview);
router
  .route("/:id")
  .get(getTourByID)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), removeTour);
router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
module.exports = router;
