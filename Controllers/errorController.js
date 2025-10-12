const AppError = require("../utils/appError");

const errOps = {
  title: "Error Page",
  message: "Tour Not Found",
};

const devErrors = (err, req, res) => {
  // api error in Dev Env
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Renderd Website Error Page In Dev Env
  errOps.status = err.statusCode;
  return res.render("error", errOps);
};

const prodErrors = (err, req, res) => {
  // api error in prod env
  if (req.originalUrl.startsWith("/api")) {
    console.error("Error", err);
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: "Fail",
      message: "Something Went Wrong!",
    });
  }
  // rendered website error page in dev env
  errOps.status = err.statusCode;
  return res.render("error", errOps);
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

handleJWTError = () => new AppError("Invalid Token Please Login Again", 401);
handleJWTExpiration = () =>
  new AppError("Token Expired Please Login Again", 401);
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";
  if (process.env.NODE_ENV === "development") {
    devErrors(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorsDB(error);
    else if (err.name === "ValidationError")
      error = handleValidationErrDB(error);
    else if (err.name === "jsonWebTokenError") error = handleJWTError();
    else if (err.name === "TokenExpiredError") error = handleJWTExpiration();
    if (err.code === 11000) error = handleDuplicatesDB(error);
    prodErrors(error, req, res);
  }
};
