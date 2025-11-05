const fs = require("fs"),
  Tour = require("../models/tourModel.js"),
  { json } = require("stream/consumers"),
  APIFeatures = require("../utils/apiFeatures.js"),
  catchAsync = require("../utils/catchAsync.js"),
  multer = require("multer"),
  sharp = require("sharp"),
  { deleteOne } = require("./handlerFacory");

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("only images can be uploaded", 400), false);
};
const upload = multer({ storage, fileFilter: multerFilter });

// uploading tour pictures
exports.uploadTourPictures = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// resize tour pictures before uploading them
exports.resizeTourPictures = catchAsync(async (req, res, next) => {
  if (!req.files.ImageCover || !req.files.images) return next();

  // making a file name to th request body by using the tour id from params
  req.body.ImageCover = `tour-${req.params.id}-${Math.floor(
    Date.now() / 10000000000
  )}-cover.jpeg`;
  await sharp(req.files.ImageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/tours/${req.body.ImageCover}`);
  // handiling and resizing the tour images and save it to the images array in the DB
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Math.floor(
        Date.now() / 10000000000
      )}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/imgs/tours/${fileName}`);

      req.body.images.push(fileName);
    })
  );
  next();
});

exports.getAllTours = catchAsync(async (req, res) => {
  // the final query
  const featuers = new APIFeatures(Tour.find({}), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await featuers.query.explain(); // explain return stats about the query
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getToursStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
exports.getTourByID = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate("review");
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.addNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

exports.removeTour = deleteOne(Tour);
// exports.removeTour = catchAsync(async (req, res) => {
//   await Tour.findByIdAndDelete(req.params.id);
//   res.status(200).json({
//     status: "Success",
//     result: {
//       message: "Tour Deleted Successfuly",
//     },
//   });
// });

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: "Success",
    result: plan.length,
    data: {
      plan,
    },
  });
});

// get tours within a specific distance
///tours-within/:distance/center/:lating/unit/:unit
exports.gettoursWithin = catchAsync((req, res, next) => {
  const { distance, lating, unit } = req.params;
  const [lat, long] = lating;

  if (!lat || !long) {
    return next(
      new AppError("Please Provide Latitude and Longtiude Respectivly")
    );
  }
  //getting the radius from the distance (need to be divided by the radius of earth :D)
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1; // checking for the unit
  const tours = Tour.find({
    startLocations: {
      $geoWithin: { $centerSphere: [[lat, long], radius] }, // will get the nearest tours for the user within the radius
    },
  });
  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
