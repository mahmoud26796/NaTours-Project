const express = require("express");
const {
  renderAllTours,
  renderTour,
  renderLoginPage,
  renderAccountPage,
  renderCheckout,
} = require("../Controllers/viewsControllers");
const { protect, isLoggedIn } = require("../Controllers/authControllers");
const router = express.Router();

router.get("/login", renderLoginPage);
router.use(isLoggedIn);
router.get("/me", renderAccountPage);
router.get("/", renderAllTours);
router.get("/tour/:slug", protect, renderTour);
router.get("/checkout", renderCheckout);
module.exports = router;
