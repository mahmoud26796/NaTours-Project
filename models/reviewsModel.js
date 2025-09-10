const mongoose = require("mongoose");

const Schema = new mongoose.Schema();

const reviewsSchema = Schema(
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
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Review Must Belong To a Tour"],
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
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
  this.populate(tour);
  next();
});
reviewsSchema.pre(/^find/, function (next) {
  this.populate(user);
  next();
});
const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
