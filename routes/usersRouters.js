const express = require("express");

const { getAllUsers } = require("../Controllers/usersControllers");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require("../Controllers/authControllers");

const router = express.Router();
// tours routes
router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/").get(getAllUsers);

module.exports = router;
