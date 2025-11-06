const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require(".././utils/appError");
const { promisify } = require("util");

// send mails for users
const Email = require("../utils/email.js");
const crypto = require("crypto");

//creates a new token for the user
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

// send response with the token fro the user
const sendJWT = (user, statusCode, res) => {
  const token = signToken(user._id);

  // sending the JWT in an HTTP only cookie for the client
  const cookiesOptions = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 204 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookiesOptions.secure = "true";
  }
  res.cookie("jwt", token, cookiesOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
  const url = `${req.protocol}://${req.host}/me`;
  await new Email(newUser, url).sendWelcome();
  res.data = {
    user: newUser,
  };
  sendJWT(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please Provide Email and Password", 400));

  const user = await User.findOne({ email }).select("+password");
  const isCorrectPassword = await user.correct(password, user.password);

  if (!user || !isCorrectPassword)
    return next(new AppError("Email Or Password is Incorrect!", 401));

  sendJWT(user, 200, res);
});

exports.logOut = (req, res) => {
  res.cookie("jwt", "logged out", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("Your Are Not Logged In, Please Login To Get Access", 401)
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError("The User Belongs To this Token Is No Longer Exists", 401)
    );

  if (user.isPasswordChanged(decoded.iat))
    return next(
      new AppError(
        "You recently Changed Your Password, Please Login again",
        401
      )
    );
  req.user = user;
  next();
});

//check if the user logged in for the renderd pages
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_TOKEN
      );
      const user = await User.findById(decoded.id);

      if (!user) return next();

      if (user.isPasswordChanged(decoded.iat)) return next();

      res.locals.user = user; // making the user accessed for our templates
      return next();
    }
  } catch (e) {
    return next(e);
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Restricted Action", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No Account With That Email Address!", 404));
  }

  const resetToken = user.createChangePassToken();

  await user.save({ validateBeforeSave: false });

  // specify the url the user can follow to change the password
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `if you forgot your password, you can update your password from this link ${resetURL} if You do not want to change your password you can just Ignore this mail `;

  // using the send email function that will create the mail with the options to send to the user
  try {
    await new Email(user, resetToken).sendPasswordReset(message);
    res.status(200).json({
      status: "Success",
      message: "Token sent To email",
    });
  } catch (e) {
    user.changePassToken = undefined;
    user.changeTokenExpire = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError("Error Sending The Email To The User", 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1- Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    changePassToken: hashedToken,
    changeTokenExpire: { $gt: Date.now() },
  });

  //2- if there is a user and the token has not expired reset pass
  if (!user) {
    return next(
      new AppError(
        "Token Invalid Or Expired Please Send Forget Password Request Again",
        400
      )
    );
  }
  // 3- update user properties and save to the database
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.changePassToken = undefined;
  user.changeTokenExpire = undefined;
  await user.save();
  //4- log the user in (send JWT)
  sendJWT(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1- get user from collection
  const { password } = req.body;
  if (!password) {
    return next(new AppError("Please Provide Password", 401));
  }
  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  //2- check if posted current password is correct
  const isCorrectPassword = await user.correct(password, user.password);
  if (!isCorrectPassword) {
    return next(new AppError("Provided Password Is Incorrect", 401));
  }
  //3- if things is correct allow to change the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //4- log user in and send JWT
  res.message = "Password Changed!";
  sendJWT(user, 200, res);
});
