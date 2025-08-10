const mongoose = require('mongoose');
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Tour Must Have A Name"],
        trim: true,
        unique: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slug: String,
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
        required : [true, 'Tour Must Have Difficulty Level'],
        enum:{
            values:['Easy', 'Medium', 'Hard'],
            message: 'Difficulty Can Only be Easy, Medium or Hard'
        }
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
        default: 4.5,
        min: [1, "Ratings Must be More Than Zero"],
        mx: [5, "Ratings Maximum is 5"]
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
    startDates:[Date],
    secretTour: {
        type: Boolean,
        default: false
     }
},{
    toJSON: {virtuals: true},
    toObject : {virtuals: true}
});

tourSchema.virtual("durationInWeeks").get(function(){
    return Math.ceil(this.duration / 7);
});

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

tourSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne: true}});
    next();
});

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match:{ secretTour: { $ne: true } } });
    next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;