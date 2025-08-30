const express = require("express");

const {
  getAllUsers,
  userUpdateInfo,
  deleteUserAccount,
} = require("../Controllers/usersControllers");
const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../Controllers/authControllers");

const router = express.Router();
// tours routes
router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/updatePassword").patch(updatePassword);

router.route("/updateInfo/:id").patch(protect, userUpdateInfo);

router.route("/deleteAccount/:id").delete(protect, deleteUserAccount);

router.route("/").get(getAllUsers);

module.exports = router;
