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

exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new AppError("User Not Found", 404));
  res.status(200).json({
    status: "Sucess",
    data: [user],
  });
});

// middleware to make sure when user want to access his data the id comes from the logged in user
exports.getMe = (req, res, next) => {
  if (!req.params.id) req.params.id = req.user._id;

  next();
};
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

//updates user withoout the id from the url (current user)
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUserAccount = deleteOne(User);
