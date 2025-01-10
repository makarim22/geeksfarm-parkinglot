const express = require('express');  
const router = express.Router();  
const { dashboard } = require('../controllers/parkingController');
const {isAdmin, isSuperAdmin, isUser} = require ('../middleware/authmiddleware2') 
const { authenticateJWT } = require('../middleware/authMiddleware');  // Adjust the path as necessary  
const adminController = require('../controllers/adminController');
// Dashboard route  

router.get('/admin/dashboard', authenticateJWT, isAdmin, dashboard);  
router.get('/admin/manage-users',authenticateJWT, isAdmin, adminController.manageUsers);  
router.get('/admin/monitor-parking',authenticateJWT, isAdmin, adminController.monitorParkingSpaces);  
module.exports = router;