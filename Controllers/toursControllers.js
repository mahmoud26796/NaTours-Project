const fs = require('fs');
const Tour = require('../models/tourModel.js');
const { json } = require('stream/consumers');
const APIFeatures = require('../utils/apiFeatures.js');
 exports.getAllTours = async (req, res) => {
     // the final query
    const featuers = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await featuers.query;
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

exports.getToursStats = async (req, res) => {
    try {
            const stats = await Tour.aggregate([
                {
                    $match: { ratingsAverage: { $gte: 4.5 } }
                },
                {
                    $group: {
                        _id: '$difficulty',
                        numTours: {$sum: 1},
                        numRatings : {$sum: '$ratingsQuantity'},
                        avgRating: {$avg: '$ratingsAverage'},
                        avgPrice: {$avg: '$price'},
                        minPrice: {$min: '$price'},
                        maxPrice: {$max: '$price'}
                    },

                },
                {
                  $sort: { avgPrice : 1 }
                }
            ]);
        res.status(200).json({
         status: 'success',
         data: {
            stats
          }
      });
    } catch (error) {
        res.status(404).json({
         status: 'Fail',
         message: "Document Not Found!"
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


exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match : {
                    startDates : {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numToursStart: { $sum : 1 }
                }
            },
        ]);

        res.status(200).json({
            status: "Success",
            result: plan.length,
            data: {
              plan
           }
        });
        
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            result: {
                message: "Data Not Found"
            }
        });
    }
};