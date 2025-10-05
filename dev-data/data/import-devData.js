const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");
const dotenv = require("dotenv");
const Review = require("../../models/reviewsModel");
const User = require("../../models/userModel");
dotenv.config({ path: "./config.env" });

console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    // await Tour.create(tours, { validateBeforeSave: false });
    // await Review.create(reviews, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    console.log("Data Loaded Successfully");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await Tour.deleteMany({});
    // await Review.deleteMany();
    await User.deleteMany();
    console.log("Data Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
