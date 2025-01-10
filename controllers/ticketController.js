// // controllers/ticketController.js  

const sequelize = require('../config/database');  // Import sequelize for raw queries  

exports.getIndividualTicket = async (req, res) => {  
    const userId = req.userId; // Get userId from session  
    const bookingId = req.params.id; // Get bookingId from params  

    try {  
        // Fetch the specific ticket details based on bookingId  
        const [ticketData] = await sequelize.query(`  
            SELECT b.id AS bookingId,  
                   b."userId",  
                   b."parkingLotId",  
                   b."startTime",  
                   b.duration,  
                   b."totalCost",  
                   u.username AS username,
                   p.name AS parkingLotName,  
                   p.address AS parkingLotLocation  
            FROM bookings AS b  
            JOIN parking_lots AS p ON b."parkingLotId" = p.id  
            JOIN users AS u ON b."userId" = u.id
            WHERE b.id = :bookingId  
            AND b."userId" = :userId  
        `, {  
            replacements: { bookingId, userId },  
            type: sequelize.QueryTypes.SELECT  
        });  

        // Check if no ticket data is found  
        if (!ticketData) {  
            return res.render('error', { message: 'Ticket not found or does not belong to this user.', error: 'Booking ID: ' + bookingId });  
        }  

        // Render the individual ticket details view  
        return res.render('user/individual-ticket', { ticket: ticketData, error: null });  
    } catch (error) {  
        console.error('Error fetching individual ticket:', error);  
        return res.render('error', { message: 'Error fetching ticket details.', error: error.message });  
    }   
};

exports.getUserTickets = async (req, res) => {  
    const userId = req.userId; // Get userId from session  
    const bookingId = req.params.id; // Get optional bookingId from params  
    const page = parseInt(req.query.page) || 1; // Get current page, default to 1  
    const limit = parseInt(req.query.limit) || 3; // Get the number of items per page, default to 3  
    const offset = (page - 1) * limit; // Calculate offset for SQL query  

    try {  
        if (bookingId) {  
            // If bookingId is provided, fetch the specific ticket details  
            const [ticketData] = await sequelize.query(`  
                SELECT b.id AS bookingId,  
                       b."userId",  
                       b."parkingLotId",  
                       b."startTime",  
                       b.duration,  
                       b."totalCost",   
                       b."vehicleId",  
                       u.username AS username,   
                       p.name AS parkingLotName,  
                       p.address AS parkingLotLocation  
                FROM bookings AS b  
                JOIN parking_lots AS p ON b."parkingLotId" = p.id  
                JOIN users AS u ON b."userId" = u.id  
                WHERE b.id = :bookingId  
                AND b."userId" = :userId  
            `, {  
                replacements: { bookingId, userId },  
                type: sequelize.QueryTypes.SELECT  
            });  

            if (!ticketData) {  
                return res.status(404).render('error', { message: 'Booking not found or does not belong to this user.', error: 'Booking ID: ' + bookingId });  
            }  

            // Convert vehicleId to text  
            ticketData.vehicleType = ticketData.vehicleId === 1 ? 'Motorcycle' : (ticketData.vehicleId === 2 ? 'Car' : 'Unknown'); // Handle unknown values if needed  

            return res.render('user/ticket', { ticket: ticketData, tickets: [], error: null });  
        } else {  
            // Get the total number of tickets for the user  
            const totalTickets = await sequelize.query(`  
                SELECT COUNT(*) as count   
                FROM bookings   
                WHERE "userId" = :userId  
            `, {  
                replacements: { userId },  
                type: sequelize.QueryTypes.SELECT  
            });  

            const totalPages = Math.ceil(totalTickets[0].count / limit); // Calculate total pages  
            
            // Fetch tickets for the current page  
            const tickets = await sequelize.query(`  
                SELECT b.id AS bookingId,  
                       b."userId",  
                       b."parkingLotId",  
                       b."startTime",  
                       b.duration,  
                       b."totalCost",  
                       b."vehicleId",   
                       u.username AS username,  
                       p.name AS parkingLotName,  
                       p.address AS parkingLotLocation  
                FROM bookings AS b  
                JOIN parking_lots AS p ON b."parkingLotId" = p.id   
                JOIN users AS u ON b."userId" = u.id   
                WHERE b."userId" = :userId  
                ORDER BY b."startTime" DESC  
                LIMIT :limit OFFSET :offset  
            `, {  
                replacements: { userId, limit, offset },  
                type: sequelize.QueryTypes.SELECT  
            });  

            // Convert vehicleId to text  
            const convertedTickets = tickets.map(ticket => {  
                return {  
                    ...ticket,  
                    vehicleType: ticket.vehicleId === 1 ? 'Motorcycle' : (ticket.vehicleId === 2 ? 'Car' : 'Unknown') // Handle unknown values if needed  
                };  
            });  

            // Render the tickets view with pagination information  
            return res.render('user/ticket', { tickets: convertedTickets, ticket: null, page, totalPages, limit, error: null });  
        }  
    } catch (error) {  
        console.error('Error fetching tickets:', error);  
        return res.render('error', { message: 'Error fetching tickets.', error: error.message });  
    }  
};