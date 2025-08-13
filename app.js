const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/appError');
const errorHandler = require('./Controllers/errorController');
const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};


app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// tours routes
const tourRouter = require('./routes/toursRouter');
//users routes
const usersRouter = require('./routes/usersRouters');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

app.all('/api/v1{/*path}', (req, res, next) => {
    // const error = new Error(`Can't Find The Requested URL ${req.originalUrl} on this Server`);
    // error.status = 'Fail';
    // error.statusCode = 404;

    next(new AppError(`Can't Find The Requested URL ${req.originalUrl} on this Server`, 404));
});

app.use(errorHandler);
module.exports = app;