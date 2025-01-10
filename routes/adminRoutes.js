// routes/adminRoutes.js  
const express = require('express');  
// const { isAdmin } = require('../middleware/authmiddleware2');  
const sequelize = require('../config/database');  
const {  isSuperAdmin, isAdmin } = require('../middleware/authmiddleware2');  
const { authenticateJWT } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const superadminController = require('../controllers/superadminController'); 
const topUpController = require('../controllers/topUpController'); 
const router = express.Router();  

// User coin management route  
router.get('admin/manage-users', isAdmin, async (req, res) => {  
    try {  
        const users = await sequelize.query(`  
            SELECT id, username, coins  
            FROM users  
        `, { type: sequelize.QueryTypes.SELECT });  

        res.render('admin/manage-users', { users });  
    } catch (error) {  
        console.error('Error fetching users:', error);  
        res.status(500).send('Server error');  
    }  
});  

router.post('/top-up', authenticateJWT, isAdmin, topUpController.topUp); 


// Monitor parking lot spaces  
router.get('/admin/monitor-parking', isAdmin, async (req, res) => {  
    try {  
        const parkingSpaces = await sequelize.query(`  
            SELECT ps.id, pl.name AS parking_lot_name, ps.is_available  
            FROM parking_spaces ps  
            JOIN parking_lots pl ON ps.parking_lot_id = pl.id  
        `, { type: sequelize.QueryTypes.SELECT });  

        res.render('monitorParking', { parkingSpaces });  
    } catch (error) {  
        console.error('Error fetching parking spaces:', error);  
        res.status(500).send('Server error');  
    }  
});  

// Update parking space availability when a user leaves  
router.post('/admin/leave-parking', isAdmin, async (req, res) => {  
    const { spaceId } = req.body;  

    try {  
        // Update the parking space to set it as available  
        await sequelize.query(`  
            UPDATE parking_spaces  
            SET is_available = TRUE  
            WHERE id = :spaceId  
        `, {  
            replacements: { spaceId },  
            type: sequelize.QueryTypes.UPDATE,  
        });  

        res.redirect('/admin/monitor-parking');  
    } catch (error) {  
        console.error('Error updating parking space availability:', error);  
        res.status(500).send('Server error');  
    }  
});  


// 
router.get('/admin/manage-users',  authenticateJWT, isAdmin, adminController.manageUsers);  
 
router.get('/messages', authenticateJWT, isAdmin, adminController.getContactMessages);  
router.get('/booking-details', authenticateJWT, isAdmin, adminController.bookingDetails); 
router.get('/superadmin', authenticateJWT, isSuperAdmin, superadminController.getSuperadminPage);
// Route to render the superadmin page  
// Route to handle user creation  
router.post('/superadmin/create', authenticateJWT, isSuperAdmin, superadminController.createUser);  
router.post('/superadmin/delete/:id', authenticateJWT, isSuperAdmin, superadminController.deleteUserAdmin);



// Route to go to the admin reset page  
router.get('/reset-spots', authenticateJWT, isAdmin, adminController.getResetSpotsPage);  

// Route to reset available spots for a specific parking lot  
router.post('/reset-spots/:id', authenticateJWT, isAdmin, adminController.resetAvailableSpots);  

module.exports = router;