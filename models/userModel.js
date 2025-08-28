const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Must Have A Name"],
    maxlength: [32, "A User Name must have less or equal then 40 characters"],
    minlength: [5, "A user Name must have more or equal then 10 characters"],
  },
  email: {
    type: String,
    required: [true, "User Must Have An Email Address"],
    unique: [true, "Email Address Must Be Unique"],
    maxlength: [
      40,
      "An Email Address Must Have less or equal then 60 characters",
    ],
    minlength: [
      10,
      "An Email Address Must Have more or equal then 40 characters",
    ],
    loweCase: true,
    validate: [validator.isEmail, "Email Not Valid"],
  },
  Photo: String,
  password: {
    type: String,
    required: [true, "Your Account Must Have A Password"],
    unique: [true, "Password Is Taken Must Be Uniqe"],
    maxLength: [32, "Password must be less or equal then 32 Numbers"],
    minLength: [8, "Password must be more or equal then 16 Numbers"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Re-enter The Password Correctly!"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Password Confrimation is Incorrect Please Enter It Again",
    },
  },
  passwordChangedAt: Date,
  changePassToken: String,
  changeTokenExpire: Date,
  role: {
    type: String,
    enum: ["admin", "lead-guide", "guide", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.correct = async function (inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

userSchema.methods.isPasswordChanged = function (jwtTimeStmp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimeStmp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createChangePassToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.changePassToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.changeTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
