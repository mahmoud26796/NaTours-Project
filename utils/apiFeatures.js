const Tour = require("../models/tourModel");

class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
     const queryObj = {...this.queryStr};
     const excludedFiels = ['page', 'sort', 'limit', 'fields'];
     excludedFiels.forEach(el => delete queryObj[el]);

     let queryStr = JSON.stringify(queryObj);
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);     
     // the query object
     this.query = Tour.find(JSON.parse(queryStr));

     return this;
    }

    sort(){
        if(this.queryStr.sort){
        let sortBy = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
     } else {
        this.query = this.query.sort('-createdAt');
     }

        return this;
    }

    limitFields(){
     // limiting fields
     if(this.queryStr.fields){
        let selected = this.queryStr.fields.split(',').join(' ');
        this.query = this.query.select(selected);
     } else {
        this.query = this.query.select('-__v');
     }
        return this;
    }

    paginate(){
    //pagination
     const page = this.queryStr.page * 1 || 1;
     const limit = this.queryStr.limit * 1 || 10;
     const skip = (page - 1) * limit; 
     this.query = this.query.skip(skip).limit(limit);
    return this;
    }
};

module.exports = APIFeatures;