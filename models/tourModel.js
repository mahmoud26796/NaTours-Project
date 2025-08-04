const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Tour Must Have A Name"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Tour Must Have a Duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour Must Have a MAx Group Size']
    },
    difficulty:{
        type: String,
        required : [true, 'Tour Must Have Difficulty Level']
    },
    ratingsAverage:{
        type: Number,
        default: 4.5
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    rating:{
        type:Number,
        default: 4.5
    },
    price:{
        type:Number,
        required: [true, "Tour Must Have A Valid Price"]
    },
    summary: {
       type: String,
       trim: true
    },
    description:{
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        trim: true
    },
    images: [String],
    startDates:[Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;