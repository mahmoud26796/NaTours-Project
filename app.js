const morgan = require('morgan');
const express = require('express');

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

app.all('*', (req, res, next) => {
   res.status(404).json({
        status: 'Fail',
       message: `Can't Find The Requested URL ${req.originalUrl} on this Server`
   });
});
module.exports = app;