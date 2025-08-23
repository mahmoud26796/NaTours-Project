const express = require("express");

const { getAllUsers } = require("../Controllers/usersControllers");
const { signUp, login } = require("../Controllers/authControllers");

const router = express.Router();
// tours routes
router.route("/signup").post(signUp);

router.route("/login").post(login);

router.route("/").get(getAllUsers);

module.exports = router;
