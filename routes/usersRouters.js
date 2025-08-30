const express = require("express");

const { getAllUsers } = require("../Controllers/usersControllers");
const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  userUpdateInfo,
} = require("../Controllers/authControllers");

const router = express.Router();
// tours routes
router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/updatePassword").patch(updatePassword);
router.route("/updateInfo/:id").patch(protect, userUpdateInfo);

router.route("/").get(getAllUsers);

module.exports = router;
