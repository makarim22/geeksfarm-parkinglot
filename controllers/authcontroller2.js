// controllers/authController2.js  
const bcrypt = require('bcrypt');  
const sequelize = require('../config/database');  
const jwt = require('jsonwebtoken'); 

exports.register = async (req, res) => {  
    try {  
        const { username, password, email } = req.body;  // Removed role from req.body  

        // Validate input  
        if (!username || !password || !email) {  
            return res.status(400).json({ success: false, error: 'All fields are required.' });  
        }  

        // Check if the username already exists  
        const [existingUser] = await sequelize.query(`  
            SELECT * FROM users WHERE username = :username  
        `, {  
            replacements: { username },  
            type: sequelize.QueryTypes.SELECT  
        });  

        if (existingUser) {  
            return res.status(400).json({ success: false, error: 'Username already exists' });  
        }  

        // Check if the email already exists  
        const [existingEmail] = await sequelize.query(`  
            SELECT * FROM users WHERE email = :email  
        `, {  
            replacements: { email },  
            type: sequelize.QueryTypes.SELECT  
        });  

        if (existingEmail) {  
            return res.status(400).json({ success: false, error: 'Email is already in use' });  
        }  

        // Validate email format  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation  
        if (!emailRegex.test(email)) {  
            return res.status(400).json({ success: false, error: 'Invalid email format.' });  
        }  

        // Validate password strength  
        const passwordStrengthRegex = /^(?=.*[!@#\$%\^\&*\)\(+=._-]).{6,}$/; // At least 6 characters and one special character  
        if (!passwordStrengthRegex.test(password)) {  
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long and contain at least one special character.' });  
        }  

        // Set roleId for user only (assuming roleId for user is always 1)  
        const roleId = 1;  // Fixed roleId for user  

        // Hash the password  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const currentTimestamp = new Date(); // Get the current timestamp  

        // Insert the new user into the database  
        await sequelize.query(`  
            INSERT INTO users (username, password, email, "roleId", "createdAt", "updatedAt")  
            VALUES (:username, :password, :email, :roleId, :createdAt, :updatedAt)  
        `, {  
            replacements: {  
                username,  
                password: hashedPassword,  
                email,  
                roleId,  
                createdAt: currentTimestamp,  
                updatedAt: currentTimestamp // Set both createdAt and updatedAt to current timestamp  
            },  
            type: sequelize.QueryTypes.INSERT  
        });  

        // Send a JSON response confirming successful registration  
        res.status(201).json({ success: true, message: 'Registration successful! Please log in.' });  
        
    } catch (error) {  
        console.error('Error during registration:', error); // Log the error for debugging  
        res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' }); // Send error response as JSON  
    }  
};

exports.login = async (req, res) => {  
    const { username, password } = req.body;  

    try {  
        // Use raw SQL to find the user by username and get the role  
        const [user] = await sequelize.query(`  
            SELECT u.id, u.username, u.password, r.role AS role_name  
            FROM users u  
            JOIN roles r ON u."roleId" = r.id  
            WHERE u.username = :username
        `, {  
            replacements: { username },  
            type: sequelize.QueryTypes.SELECT,  
        });  

        // Check if the user exists  
        if (!user) {  
            // Render login page with error message  
            return res.render('login', { error: 'Invalid username and password' });  
        }  

        // Check if the password is correct  
        if (await bcrypt.compare(password, user.password)) {  
            // User authentication successful  
            const token = jwt.sign({  
                id: user.id,  
                role: user.role_name,  
                username: user.username // Add the username to the token payload  
            }, process.env.JWT_SECRET, {  
                expiresIn: '1h', // Token expiry time  
            });  

            // Set the token in a cookie  
            res.cookie('token', token, {  
                httpOnly: true, // Prevent client-side access to the cookie  
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production  
                maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)  
            });  

            // Redirect based on user role  
            if (user.role_name === 'admin' || user.role_name === 'superadmin') {  
                return res.redirect('/admin/dashboard');  
            } else {  
                return res.redirect('/user/dashboard');  
            }  
        } else {  
            // Render login page with error message  
            return res.render('login', { error: 'Invalid username and password' });  
        }  
    } catch (error) {  
        console.error('Login Error:', error);  
        // Render login page with generic error message  
        return res.render('login', { error: 'Internal Server Error. Please try again later.' });  
    }  
};
//render login form
exports.showLoginForm = (req, res) => {  
    res.render('login',{ error: null }); // Render login view  
};
// render reset password form
exports.showResetForm = (req, res) => {  
    res.render('reset-password',{ error: null , success : null}); // Render login view  
};

// fungsi logout
exports.logout = async (req, res) => {  
    try {  
        // Check if the user is authenticated by checking for userId from JWT  
        const userId = req.userId; // Assuming userId is set during JWT authentication  

        if (userId) {  
            // If using session storage, destroy the session  
            req.session.destroy((err) => {  
                if (err) {  
                    return res.status(500).json({ message: 'Could not log out, please try again.' });  
                }  
                // Clear the token cookie  
                res.clearCookie('token'); // Assuming your token is stored in a cookie named 'token'  
                // Redirect to the login page or home page after logout  
                return res.redirect('/login');  
            });  
        } else {  
            // Handle logout for token-based authentication  
            const token = req.cookies.token; // Retrieve the token from cookies  

            if (token) {  
                // Clear the token cookie  
                res.clearCookie('token'); // Clear the cookie to log out the user  
                // return res.json({ message: 'Logged out successfully. Please refresh the page.' });  
                return res.redirect ('login')
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
// fungsi reset  password
exports.resetPassword = async (req, res) => {  
    try {  
        const { username, password } = req.body;  

        console.log('Attempting password reset for:', username);  

        // Check password strength  
        const passwordStrengthRegex = /^(?=.*[!@#\$%\^\&*\)\(+=._-]).{6,}$/;  
        if (!passwordStrengthRegex.test(password)) {  
            console.log('Password strength validation failed.');  
            return res.render('reset-password', {  
                error: 'Password must be at least 6 characters long and contain at least one special character.',  
                success: null  
            });  
        }  

        // Check if the user exists  
        const [user] = await sequelize.query(`  
            SELECT * FROM users WHERE username = :username  
        `, {  
            replacements: { username },  
            type: sequelize.QueryTypes.SELECT  
        });  

        if (!user) {  
            console.log('User not found:', username);  
            return res.render('reset-password', {  
                error: 'User not found',  
                success: null  
            });  
        }  

        // Hash the new password  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Update the password in the database with the hashed password  
        await sequelize.query(`  
            UPDATE users SET password = :password WHERE username = :username  
        `, {  
            replacements: { password: hashedPassword, username }  
        });  

        // Render the reset password page with a success message  
        console.log('Password reset successful for:', username);  
        return res.render('reset-password', {  
            success: 'Yeah! You got the new password, don’t forget it again!',  
            error: null  
        });  
    } catch (error) {  
        console.error('Error during password reset:', error);  
        return res.status(500).render('reset-password', {  
            error: 'Internal Server Error. Please try again later.',  
            success: null  
        });  
    }  
};
