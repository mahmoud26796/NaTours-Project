const express = require("express"),
  router = express.Router(),
  { getCheckoutSession } = require("../Controllers/bookingController"),
  { protect } = require("../Controllers/authControllers");

router.use(protect);
router.get("/checkout/:tourId", getCheckoutSession);

module.exports = router;
