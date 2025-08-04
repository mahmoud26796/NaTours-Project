const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: "./config.env"});
const app = require('./app.js');

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(() => console.log("Database Connected"))
    .catch(e => console.log(e));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening... on port", port);
});