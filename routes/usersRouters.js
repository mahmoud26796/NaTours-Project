const express = require('express');

const router = express.Router();
const {getAllUsers} = require('../Controllers/usersControllers');
// tours routes
router
    .route('/').get(getAllUsers);

module.exports = router;