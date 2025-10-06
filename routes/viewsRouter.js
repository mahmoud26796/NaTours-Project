const express = require("express");
const {
  renderAllTours,
  renderTour,
  renderLoginPage,
} = require("../Controllers/viewsControllers");
const { protect } = require("../Controllers/authControllers");
const router = express.Router();

router.get("/", renderAllTours);

router.get("/login", renderLoginPage);

router.use(protect);
router.get("/tour/:slug", renderTour);

module.exports = router;
