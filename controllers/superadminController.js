// controllers/superadminController.js  
const sequelize = require('../config/database'); // Adjust based on your setup  
const bcrypt = require('bcrypt');   

exports.getSuperadminPage = async (req, res, next) => {  
    try {  
        // Fetch all users and admins  
        const users = await sequelize.query(`  
            SELECT u.id, u.username, u.email, r.role FROM users u
            join roles r on u."roleId" = r.id
            WHERE u."deletedAt" IS NULL 
            and r.id != 3
        `, {  
            type: sequelize.QueryTypes.SELECT  
        });  

        // Render Superadmin page with user data  
        return res.render('admin/superadmin', { users });  
    } catch (error) {  
        console.error('Error fetching users:', error);  

        // Pass the error to the next middleware (error handler)  
        return next({  
            message: 'Unable to load users.',  
            error: error.message  
        });  
    }  
};


exports.deleteUserAdmin = async (req, res, next) => {  
    console.log('Delete route hit');  // Debugging line  
    const { id } = req.params; // Get user or admin ID from params  

    try {  
        // Soft delete by setting deletedAt with the current time  
        await sequelize.query(`  
            UPDATE users  SET "deletedAt" = NOW() WHERE id = :id  
        `, {  
            replacements: { id },  
            type: sequelize.QueryTypes.UPDATE  
        });  

        return res.redirect('/admin/superadmin'); // Redirect back to superadmin page after deletion  
    } catch (error) {  
        console.error('Error deleting user/admin:', error);  
        return next({  
            message: 'Unable to delete user/admin.',  
            error: error.message  
        });  
    }  
};

exports.createUser = async (req, res) => {  
    try {  
        const { username, email, role, password } = req.body;  

        // Validate that all fields are provided  
        if (!username || !email || !role || !password) {  
            return res.status(400).send('All fields are required.');  
        }  

        // Validate email format: You can add more robust email validation if needed  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        if (!emailRegex.test(email)) {  
            return res.status(400).send('Invalid email format.');  
        }  

        // Determine roleId based on the role  
        let roleId;  
        switch (role.toLowerCase()) {  
            case 'user':  
                roleId = 1;  
                break;  
            case 'admin':  
                roleId = 2;  
                break;  
            default:  
                return res.status(400).send('Invalid role specified.');  
        }  

        // Hash the password  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const currentTimestamp = new Date();

        // Use raw SQL to create a new user  
        const [results, metadata] = await sequelize.query(`  
            INSERT INTO users (username, email, "roleId", password ,"createdAt", "updatedAt")  
            VALUES (:username, :email, :roleId, :password, :createdAt, :updatedAt)  
        `, {  
            replacements: {  
                username,  
                email,  
                roleId,  
                password: hashedPassword,
                createdAt: currentTimestamp,  
                updatedAt: currentTimestamp   
            }   
        });  

        res.redirect('/admin/superadmin');  
    } catch (error) {  
        console.error('Error creating user:', error);  
        res.status(500).send('An error occurred while creating the user.');  
    }  
};
