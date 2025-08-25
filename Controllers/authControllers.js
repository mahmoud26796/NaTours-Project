const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require(".././utils/appError");
const { promisify } = require("util");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please Provide Email and Password", 400));

  const user = await User.findOne({ email }).select("+password");
  const isCorrectPassword = await user.correct(password, user.password);

  if (!user || !isCorrectPassword)
    return next(new AppError("Email Or Password is Incorrect!", 401));

  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("Your Are Not Logged In, Please Login To Get Access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );
  console.log(decoded);

  next();
});
