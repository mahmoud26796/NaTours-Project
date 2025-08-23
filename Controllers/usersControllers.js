const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

// users resource
// reading users data from txt file
// const users = JSON.parse(fs.readFileSync(`./dev-data/data/users.json`));

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
