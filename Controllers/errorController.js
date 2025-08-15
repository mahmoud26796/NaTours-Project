const AppError = require("../utils/appError");

const devErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodErrors = (err, res) => {
  console.error("Error", err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Fail",
      message: "Something Went Wrong!",
    });
  }
};

const handleCastErrorsDB = (err) => {
  const msg = `invalid ${err.path} as ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicatesDB = (err) => {
  const val = err.keyValue.name;
  console.log(val);

  const msg = `${val} is Duplicated Please Use Another Value`;
  return new AppError(msg, 400);
};

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid Data ${errors.join(". ")}`, 400);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";
  if (process.env.NODE_ENV === "development") {
    const errors = Object.values(err.errors).map((el) => el.message);
    if (err.name === "ValidationError") console.log(errors);
    devErrors(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log("operational => ", error.isOperational);

    if (err.name === "CastError") error = handleCastErrorsDB(error);
    else if (err.name === "ValidationError")
      error = handleValidationErrDB(error);
    if (err.code === 11000) error = handleDuplicatesDB(error);
    prodErrors(error, res);
  }
};
