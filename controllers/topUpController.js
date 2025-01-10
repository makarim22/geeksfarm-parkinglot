const  sequelize  = require('../config/database'); // Double-check import path 

async function getAllUsers() {  
    try {  
        const users = await sequelize.query('SELECT * FROM users', {  
            type: sequelize.QueryTypes.SELECT  
        });  
        return users;  
    } catch (error) {  
        console.error('Error fetching users:', error);  
        throw error; // Propagate error if needed  
    }  
}  

exports.topUp = async (req, res) => {  
    try {  
        console.log('Received Request Body:', req.body);  
        console.log('Sequelize Instance:', sequelize);   
        const userId = req.userId;  
        const userRole = req.userRole;  

        if (userRole !== 'admin' && userRole !== 'superadmin') {  
            return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });  
        }  

        const { userId: targetUserId, amount } = req.body;  

        if (!targetUserId || !amount) {  
            console.error('Required fields are missing:', { targetUserId, amount });   
            return res.status(400).json({ message: 'Required fields are missing.' });  
        }  
        
        if (isNaN(amount) || amount <= 0) {  
            return res.status(400).json({ message: 'Invalid top-up amount.' });  
        }  

        console.log(`Topping up ${amount} coins for user ID ${targetUserId}`);  

        const [result] = await sequelize.query(`  
            UPDATE users  
            SET coins = coins + :amount  
            WHERE id = :userId  
        `, {  
            replacements: { amount, userId: targetUserId },  
            type: sequelize.QueryTypes.UPDATE  
        });  

        if (result[1] === 0) {  
            return res.status(404).json({ message: 'User not found.' });  
        }  

        // Render the EJS view with a success message  
        res.render('admin/manage-users', { // Adjust the view name  
            message: `Successfully topped up IDR ${amount}  for user ID ${targetUserId}.`, // Pass the message  
            users: await getAllUsers(), // Pass the users back to the view (implement getAllUsers function)  
            userId: req.userId, // Ensure to pass any other necessary user data  
            userRole: req.userRole // Optional: pass user role if needed  
        });   
    } catch (error) {  
        console.error('Error during top-up:', error.message);  
        console.error('Full error:', error);  
        res.status(500).json({ message: 'An error occurred during the top-up process.', error: error.message });  
    }  
};