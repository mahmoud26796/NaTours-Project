const express = require("express");

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
// tours routes
router.route("/").get(protect, getAllTours).post(addNewTour);
router
  .route("/:id")
  .get(getTourByID)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), removeTour);
router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/:tourId/reviews").post(protect, restrictTo("user"), addReview);
module.exports = router;
