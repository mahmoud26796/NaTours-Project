const express = require("express");

const {
  getAllUsers,
  getUserById,
  getMe,
  userUpdateInfo,
  updateMe,
  deleteUserAccount,
} = require("../Controllers/usersControllers");
const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logOut,
} = require("../Controllers/authControllers");

const router = express.Router();
// tours routes
router.route("/signup").post(signUp);

router.route("/login").post(login);
router.route("/logout").get(logOut);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

// this middleware applies for all the following routes
router.use(protect);

router.route("/updatePassword").patch(updatePassword);

router.route("/updateInfo/:id").patch(userUpdateInfo);

router.route("/updateMe").patch(updateMe);

router.route("/deleteAccount/:id").delete(deleteUserAccount);

router.route("/me").get(getMe, getUserById);

router.use(restrictTo("admin", "lead-guide"));
router.route("/:id").get(getUserById);

router.route("/").get(getAllUsers);

module.exports = router;
