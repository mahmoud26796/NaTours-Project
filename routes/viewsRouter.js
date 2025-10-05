const express = require("express");
const {
  renderAllTours,
  renderRoot,
  renderTour,
} = require("../Controllers/viewsControllers");
const { render } = require("../app");
const router = express.Router();

router.get("/", renderAllTours);
// router.get("/overview", renderAllTours);
router.get("/tour/:id", renderTour);
// router.get("/tour", renderTour);

module.exports = router;
