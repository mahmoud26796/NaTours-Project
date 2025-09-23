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
router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/")
  .get(protect, getAllTours)
  .post(addNewTour)
  .post(protect, restrictTo("user"), addReview);
router.use(protect, restrictTo("admin", "lead-guide"));
router.route("/:id").get(getTourByID).patch(updateTour).delete(removeTour);
module.exports = router;
