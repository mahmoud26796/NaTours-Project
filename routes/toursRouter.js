const express = require('express');

const router = express.Router();
const {getAllTours, getTourByID,addNewTour, updateTour, removeTour, getToursStats, getMonthlyPlan} = require('../Controllers/toursControllers');

// tours routes
router
    .route('/').get(getAllTours)
    .post(addNewTour);
router
    .route('/:id')
    .get(getTourByID)
    .patch(updateTour)
    .delete(removeTour);
router
    .route('/tours-stats').get(getToursStats);
router
    .route('/monthly-plan/:year').get(getMonthlyPlan);


module.exports = router;