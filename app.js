const morgan = require('morgan');
const express = require('express');

const app = express();
app.use(express.json());

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};


app.use(express.static(`${__dirname}/public`));

// tours routes
const tourRouter = require('./routes/toursRouter');
//users routes
const usersRouter = require('./routes/usersRouters');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;