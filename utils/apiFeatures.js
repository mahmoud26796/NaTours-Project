const Tour = require("../models/tourModel");
const qs = require("qs"); // i used third party parser instead of JSON to correctly parse mongo operators like (lt,gt)
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFiels = ["page", "sort", "limit", "fields"];
    excludedFiels.forEach((el) => delete queryObj[el]);

    let queryStr = qs.stringify(queryObj);
    queryStr = queryStr.replace(/(gte|gt|lte|lt)/gi, (match) => `$${match}`);
    // the query object
    this.query = this.query.find(qs.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    // limiting fields
    if (this.queryString.fields) {
      let selected = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selected);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
