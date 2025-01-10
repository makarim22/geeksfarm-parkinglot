const sequelize = require('../config/database');

class AdminController {  
    // Monitor parking spaces  
    async monitorParkingSpaces(req, res) {  
        try {  
            const result = await sequelize.query(`  
                SELECT * from parking_lots
            `);  

            res.render('admin/monitor-parking', { parkingLots: result[0] }); // Sequelize returns an array: [results, metadata]  
        } catch (error) {  
            console.error('Error fetching parking lots:', error);  
            res.status(500).send('Server error');  
        }  
    }  

    // Manage Users  
    async manageUsers(req, res) {  
        try {  
            const result = await sequelize.query(`SELECT id, username, coins FROM users`); // Adjust query as necessary  
            
            // Render the manage users view and pass users data  
            res.render('admin/manage-users', { users: result[0] }); // result[0] contains the actual data  
        } catch (error) {  
            console.error('Error fetching users:', error);  
            res.status(500).send('Server error');  
        }  
    }  

    // Park a vehicle  
    async parkVehicle(req, res) {  
        const { parkingLotId, vehicleType } = req.body;  

        try {  
            const availableSpaceResult = await sequelize.query(`  
                SELECT id FROM parking_spaces   
                WHERE parking_lot_id = :parkingLotId AND is_available = TRUE   
                LIMIT 1  
            `, {  
                replacements: { parkingLotId } // Use replacements for parameters  
            });  

            if (availableSpaceResult[0].length === 0) {  
                return res.status(400).json({ message: 'No available parking spaces!' });  
            }  

            const availableSpaceId = availableSpaceResult[0][0].id; // Get the first available space id  

            // Update the parking space to occupied  
            await sequelize.query(`  
                UPDATE parking_spaces   
                SET is_available = FALSE   
                WHERE id = :availableSpaceId  
            `, {  
                replacements: { availableSpaceId } // Use replacements for parameters  
            });  

            // Update the corresponding parking lot available spots  
            if (vehicleType === 'motorcycle') {  
                await sequelize.query(`  
                    UPDATE parking_lots   
                    SET motorcycle_available_spots = motorcycle_available_spots - 1   
                    WHERE id = :parkingLotId  
                `, {  
                    replacements: { parkingLotId }  
                });  
            } else if (vehicleType === 'car') {  
                await sequelize.query(`  
                    UPDATE parking_lots   
                    SET car_available_spots = car_available_spots - 1   
                    WHERE id = :parkingLotId  
                `, {  
                    replacements: { parkingLotId }  
                });  
            }  

            res.status(200).json({ message: 'Vehicle parked successfully!' });  
        } catch (error) {  
            console.error('Error parking vehicle:', error);  
            res.status(500).json({ message: 'Server error' });  
        }  
    }  

    // Leave a vehicle  
    async leaveVehicle(req, res) {  
        const { parkingLotId, spaceId } = req.body;  

        try {  
            // Mark the parking space as available  
            await sequelize.query(`  
                UPDATE parking_spaces   
                SET is_available = TRUE   
                WHERE id = :spaceId  
            `, {  
                replacements: { spaceId }  
            });  

            // Update the corresponding parking lot available spots  
            await sequelize.query(`  
                UPDATE parking_lots   
                SET motorcycle_available_spots = motorcycle_available_spots + 1   
                WHERE id = :parkingLotId  
            `, {  
                replacements: { parkingLotId }  
            });  

            res.status(200).json({ message: 'Vehicle left successfully!' });  
        } catch (error) {  
            console.error('Error leaving vehicle:', error);  
            res.status(500).json({ message: 'Server error' });  
        }  
    }  
    async bookingDetails(req, res) {  
        const { lotId } = req.query; // Get the lotId from query params  

        // Validate that lotId is provided  
        if (!lotId) {  
            return res.status(400).send('Lot ID is required');  
        }  

        try {  
            // Fetch the booking details for a specific parking lot  
            const bookingsDetails = await sequelize.query(  
                `SELECT * FROM bookings WHERE "parkingLotId" = :lotId`,  
                {  
                    replacements: { lotId },  
                    type: sequelize.QueryTypes.SELECT,  
                }  
            );  

            // Render the booking details page  
            res.render('admin/booking-details', {  
                bookings: bookingsDetails, // Pass the booking details to the view  
                title: 'Booking Details',  
            });  
        } catch (error) {  
            console.error('Error fetching booking details:', error);  
            res.render('error', {  
                message: 'Error fetching booking details',  
                error: error.message,  
            });  
        }  
    }  
    async getContactMessages(req, res) {  
        try {  
            const [results, metadata] = await sequelize.query(  
                'SELECT cm.id, cm.name, cm.email, cm.message, cm.created_at, u.username ' +  
                'FROM contact_messages cm ' +  
                'JOIN users u ON cm.user_id = u.id ' +  
                'ORDER BY cm.created_at DESC'  
            );  

            // Render the admin page with the messages data  
            res.render('admin/messages', { messages: results });  
        } catch (error) {  
            console.error('Error fetching messages:', error);  
            res.status(500).send('Internal Server Error. Please try again later.');  
        }  
    }  
    async getResetSpotsPage(req, res) {  
        try {  
            const parkingLots = await sequelize.query(`SELECT * FROM parking_lots`);  
            res.render('admin/reset-spots', { parkingLots: parkingLots[0] });  
        } catch (error) {  
            console.error('Error fetching parking lots:', error);  
            res.status(500).send('Server error');  
        }  
    }  

    // Reset available spots  
    async resetAvailableSpots(req, res) {  
        const parkingLotId = req.params.id;  

        try {  
            const [result] = await sequelize.query(`  
                UPDATE parking_lots  
                SET "motorcycleAvailableSpot" = "motorcycleCapacity",  
                    "carAvailableSpot" = "carCapacity"  
                WHERE id = :id  
            `, {  
                replacements: { id: parkingLotId }  
            });  

            if (result.affectedRows === 0) {  
                return res.status(404).json({ success: false, error: 'Parking lot not found.' });  
            }  

            res.json({ success: true, message: 'Available spots reset successfully.' });  
        } catch (error) {  
            console.error('Error resetting available spots:', error);  
            res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });  
        }  
    }  
};  

module.exports = new AdminController();