const fs = require('fs');
const Tour = require('../models/tourModel.js');
const { json } = require('stream/consumers');

class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
     const queryObj = this.queryStr;
     const excludedFiels = ['page', 'sort', 'limit', 'fields'];
     excludedFiels.forEach(el => delete queryObj[el]);

     let queryStr = JSON.stringify(queryObj);
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     console.log(JSON.parse(queryStr));
     
     // the query object
     this.query= Tour.find(JSON.parse(queryStr));

     return this;
    }

    sort(){

        return this;
    }

    limitFields(){
        return this;
    }

    paginate(){
        return this;
    }
};
 exports.getAllTours = async (req, res) => {
     const queryObj = {...req.query};
     const excludedFiels = ['page', 'sort', 'limit', 'fields'];
     excludedFiels.forEach(el => delete queryObj[el]);

     let queryStr = JSON.stringify(queryObj);
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     console.log(JSON.parse(queryStr));
     
     // the query object
     let query = Tour.find(queryObj)

     // sorting fields
     if(req.query.sort){
        let sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
     } else {
        query = query.sort('-createdAt');
     }

     // limiting fields
     if(req.query.fields){
        let selected = req.query.fields.split(',').join(' ');
        query = query.select(selected);
     } else {
        query = query.select('-__v');
     }

     //pagination
     const page = req.query.page * 1 || 1;
     const limit = req.query.limit * 1 || 10;
     const skip = (page - 1) * limit; 
     query = query.skip(skip).limit(limit);

     // the final query
     const toursTotal = await Tour.countDocuments();     
     if(page > (toursTotal / limit)){         
         res.status(404).json({
          status: 'Fail',
          message: "Page Does Not Exist"
       });
       return;
     }
    const tours = await query;
    try{
         res.status(200).json({
         status: 'success',
         results: tours.length,
         data: {
            tours
          }
      });
    } catch(e){
        res.status(404).json({
         status: 'Fail',
         message: "Data Not Found!"
      });
    }
};

exports.getTourByID = async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    try {
        res.status(200).json({
         status: 'success',
         data: {
            tour
          }
      });
    } catch (error) {
        res.status(404).json({
         status: 'Fail',
         message: 'Tour Not Found!'
      });
    }
};

exports.addNewTour = async (req, res) => {
    const newTour = await Tour.create(req.body);
    try{
        res.status(200).json({
        status: 'Success',
        data: {
            tour: newTour
        }
     });
    } catch(err){
        res.status(400).json({
            status: "Fail",
            message: 'Invalid Data Sent!'
        })
    }

};

exports.updateTour = async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true
    })
    try {
        res.status(200).json({
        status: "Success",
        data: {
            tour
        }
     });
    } catch (error) {
         res.status(400).json({
        status: "Fail",
        message: 'Update Request Failed!'
      });
    }
};

exports.removeTour = async (req, res) => {
    await Tour.findByIdAndDelete(req.params.id);
    try{
        res.status(200).json({
            status: "Success",
            result: {
                message: "Tour Deleted Successfuly"
            }
        });
    } catch(e){
        res.status(404).json({
            status: "Fail",
            result: {
                message: "Tour Not Found, Deletion disapproved"
            }
        });
    }
};
