const User = require('../models/User');  
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');  

exports.register = async (req, res) => {  
    const { username, password, email, role } = req.body;  

    // Validate input  
    if (!username || !password || !email || !role) {  
        return res.render('register', { error: 'All fields are required.' });  
    }  

    // Check if the user already exists  
    const existingUser = await User.findOne({ where: { username } });  
    if (existingUser) {  
        return res.render('register', { error: 'Username already exists' });  
    }  

    // Map role to roleId  
    let roleId;  
    switch (role) {  
        case 'user':  
            roleId = 1;  
            break;  
        case 'admin':  
            roleId = 2;  
            break;  
        case 'superadmin':  
            roleId = 3;  
            break;  
        default:  
            return res.render('register', { error: 'Invalid role selected' });  
    }  

    // Hash the password  
    const hashedPassword = await bcrypt.hash(password, 10);  

    // Create a new user  
    try {  
        await User.create({ username, password: hashedPassword, email, roleId });  
        res.redirect('/login'); // Redirect to login after successful registration  
    } catch (error) {  
        console.error('Error creating user:', error);  
        res.render('register', { error: 'Registration failed. Please try again.' });  
    }  
};
exports.login = async (req, res) => {  
    const { username, password } = req.body;  
    const user = await User.findOne({ where: { username } });  

    if (user && await bcrypt.compare(password, user.password)) {  
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });  
        
        // Redirect to the dashboard with the token in the session (or set it in local storage in the client)  
        req.session.token = token;
        req.session.userId = user.id; // Store the token in the session if using session storage  
        return res.redirect('/dashboard');  
    } else {  
        res.render('login', { error: 'Invalid credentials' });  
    }  
}; 
// Logout function  
exports.logout = async (req, res) => {  
    try {  
        // Check if the user is authenticated  
        if (req.session.userId) {  
            // If using session storage, destroy the session  
            req.session.destroy((err) => {  
                if (err) {  
                    return res.status(500).json({ message: 'Could not log out, please try again.' });  
                }  
                // Redirect to the login page or home page after logout  
                return res.redirect('/login');  
            });  
        } else {  
            // If not using sessions (e.g., for token-based logouts)  
            const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent in the Authorization header  

            if (token) {  
                // In a JWT scenario, you usually handle token invalidation on the client-side  
                return res.json({ message: 'Logged out successfully. Please clear your token from client storage.' });  
            } else {  
                // If already logged out or not authenticated  
                return res.status(400).json({ message: 'No user is logged in.' });  
            }  
        }  
    } catch (error) {  
        console.error('Logout error:', error);  
        return res.status(500).json({ message: 'An error occurred during logout.' });  
    }  
};