const express = require("express");
const {
  renderAllTours,
  renderTour,
  renderLoginPage,
} = require("../Controllers/viewsControllers");
const { protect, isLoggedIn } = require("../Controllers/authControllers");
const router = express.Router();

router.get("/", renderAllTours);

router.get("/login", renderLoginPage);

router.use(isLoggedIn);
router.get("/tour/:slug", renderTour);

module.exports = router;
