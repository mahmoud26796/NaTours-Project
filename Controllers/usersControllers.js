const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { deleteOne } = require("./handlerFacory");
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

exports.userUpdateInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Please Provide Correct ID", 401));
  }
  const { newName, newEmail } = req.body;
  if (!newName && !newEmail) {
    return next(
      new AppError(
        "Please Provide The Fields You Want To Change [name or email] or Cancel",
        401
      )
    );
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Account Not Found", 404));
  }
  if (newName !== undefined) user.name = newName;
  if (newEmail !== undefined) user.email = newEmail;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success",
    message: "Information Updated!",
  });
});

exports.deleteUserAccount = deleteOne(User);
