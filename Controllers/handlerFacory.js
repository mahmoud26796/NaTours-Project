const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("Please Provide Correct ID", 401));
    }
    await Model.findByIdAndDelete(id);
    res.status(200).json({
      status: "Success",
      message: "Document Deleted Successfuly!",
    });
  });
