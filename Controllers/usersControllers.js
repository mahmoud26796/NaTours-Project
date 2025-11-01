//                                                USER RESOURCE

const fs = require("fs"),
  catchAsync = require("../utils/catchAsync"),
  User = require("../models/userModel"),
  AppError = require("../utils/appError"),
  { deleteOne } = require("./handlerFacory"),
  multer = require("multer"),
  path = require("path");

/**
 *  reading users data from txt file
 * const users = JSON.parse(fs.readFileSync(`./dev-data/data/users.json`));
 */

// multer desk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/imgs/users");
  },
  filename: function (req, file, cb) {
    const name = `user-${req.user.id}-${Math.floor(Date.now() / 10000000000)}.${
      file.mimetype.split("/")[1]
    }`;
    cb(null, name);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("oly images can be uploaded", 400), false);
};

const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadUserImage = upload.single("photo");

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
  let reqObj = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.file) {
    reqObj.photo = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, reqObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUserAccount = deleteOne(User);
