const mongoose = require("mongoose");
const { path } = require("../app");

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

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name'
  });
  next();
});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
