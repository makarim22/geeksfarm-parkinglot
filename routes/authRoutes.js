const express = require('express');  
const router = express.Router();  
const authController = require('../controllers/authController2');  
 
// Registration route  
router.get('/register', (req, res) => {  
    res.render('register', { error: null }); // Render the registration page with no error initially  
});  

router.post('/register', authController.register); 
 

router.get('/login', authController.showLoginForm);  
router.post('/login', authController.login);  

// logout
router.post('/logout', authController.logout); // Use POST for logout for better security  

router.get('/reset-password', authController.showResetForm); 
router.post('/reset-password', authController.resetPassword); 


module.exports = router;

