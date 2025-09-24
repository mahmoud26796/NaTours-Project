const mongoose = require("mongoose");
const Tour = require("./tourModel");
const reviewsSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "This Field Is Required To Post A Review"],
    },
    rating: {
      type: Number,
      defaul: 1,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Review Must Belong To a Tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Review Must Belong To a User"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*
this is a function on the model schema that will calculate the ratings average 
by aggregation pipeline 
*/
reviewsSchema.statics.calculateRatingsAvg = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "tour",
        nratings: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);
  // save the updated info for each tour after each new reivew is added
  if (stats.length > 0) {
    // make sure if there is no reviews no error produced to the client
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};
reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

// before save the new doc (review) call the calc rating avg function
reviewsSchema.post("save", function () {
  this.constructor.calculateRatingsAvg(this.tour);
});
const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
