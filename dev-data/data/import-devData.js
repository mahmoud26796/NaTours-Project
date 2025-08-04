const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({path: '../../config.env'});
const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(() => console.log("Database Connected"))
    .catch(e => console.log(e));

const tours = JSON.parse(fs.readFileSync('tours-simple.json', "utf-8"));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data Loaded Successfully");
    } catch (error) {
        console.log(error);  
    }
    process.exit();
};


const deleteData = async () => {
    try {
        await Tour.deleteMany({});
        console.log("Data Deleted Successfully");
    } catch (error) {
        console.log(error);
        
    }
    process.exit();
};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete') {
    deleteData();
};


