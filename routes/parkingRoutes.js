const express = require('express');  
const router = express.Router();  
const parkingController = require('../controllers/parkingController');  
const bookingController = require('../controllers/bookingController');  
const { authenticateJWT } = require('../middleware/authMiddleware');  

// Dashboard route  
router.get('/dashboard',  parkingController.dashboard);  

module.exports = router;