const express = require('express');

const router = express.Router();
const {getAllTours, getTourByID,addNewTour, updateTour, removeTour} = require('../Controllers/toursControllers');

// tours routes
router
    .route('/').get(getAllTours)
    .post(addNewTour);
router
    .route('/:id')
    .get(getTourByID)
    .patch(updateTour)
    .delete(removeTour);

module.exports = router;