const ParkingLot = require("../models/ParkingLot"); // Import your ParkingLot model
const User = require("../models/User");
const sequelize = require("../config/database");

exports.dashboard = async (req, res) => {  
    try {  
      const userId = req.userId; // Get user ID from JWT  
      const name = req.username; // Assuming the username was included in the JWT payload  
      const userRole = req.userRole; // Get the user's role from JWT  
  
      // Log the retrieved values for debugging  
      console.log("User ID:", userId);  
      console.log("Username:", name);  
      console.log("User Role:", userRole);  
  
      if (!userId) {  
        return res.redirect("/login"); // Redirect to login if user is not authenticated  
      }  
  
      // Fetch parking lots using raw SQL  
      const parkingLots = await sequelize.query(  
        `  
              SELECT * FROM parking_lots;  
          `,  
        { type: sequelize.QueryTypes.SELECT }  
      );  
  
      // Fetch booking data and aggregate information  
      const bookings = await sequelize.query(  
        `  
          SELECT   
              p.id AS parkingLotId,  
              p.name AS parkingLotName,  
              COUNT(b.id) AS bookingCount,  
              SUM(b."totalCost") AS totalRevenue  
          FROM bookings b  
          JOIN parking_lots p ON b."parkingLotId" = p.id  
          GROUP BY p.id, p.name;  
        `,  
        { type: sequelize.QueryTypes.SELECT }  
      );  
  
      // Log the bookings data for debugging  
      console.log("Bookings Data:", bookings); // Log the array of bookings  
      const totalCustomersResult = await sequelize.query(`  
        SELECT COUNT(DISTINCT "userId") AS total_customers FROM bookings;  
    `, { type: sequelize.QueryTypes.SELECT });  

    const totalCustomers = totalCustomersResult[0].total_customers || 0; 
      // Create a mapping of parking lots to their corresponding bookings data  
      const bookingsMap = {};  
      bookings.forEach((booking) => {  
        // Log each booking entry for validation  
        console.log("Mapping booking:", booking);  
  
        // Map using the exact lowercase keys from the bookings result  
        bookingsMap[booking.parkinglotid] = {  
          bookingCount: parseInt(booking.bookingcount) || 0, // Convert to integer  
          totalRevenue: parseFloat(booking.totalrevenue) || 0, // Convert to float  
        };  
      });  
  
      // Log the bookingsMap to see what it consists of  
      console.log("Bookings Map:", bookingsMap);  
  
      // Attach additional data (bookingCount and totalRevenue) to the parkingLots object  
      const parkingLotsWithData = parkingLots.map((lot) => {  
        // Log each parking lot for debugging  
        console.log("Processing parking lot:", lot);  
  
        const bookingInformation = bookingsMap[lot.id] || { bookingCount: 0, totalRevenue: 0 };  
        console.log("Booking Info for Lot ID", lot.id, ":", bookingInformation); // Log booking info for this lot  
  
        return {  
          ...lot,  
          bookingHistory: bookingInformation.bookingCount,  
          revenueGenerated: bookingInformation.totalRevenue,  
        };  
      });  
  
      
      const errorMessage = req.query.error || null;  
      const successMessage = req.query.success || null;  
      // Log the final parkingLotsWithData to see the result  
      console.log("Parking Lots With Data:", parkingLotsWithData);  
  
      // Check user roles and render appropriate dashboard  
      if (userRole === "admin" || userRole === "superadmin") {  
        res.render("admin/dashboard", {  
          title: "Admin Dashboard", // Title for admin dashboard  
          parkingLots: parkingLotsWithData, // Pass modified parking lots data  
          userId, // Pass user ID to the dashboard  
          name, 
          totalCustomers
          // Pass the user name  
        });  
      } else {  
        // Render user dashboard for regular users  
        res.render("user/dashboard", {  
          title: "User Dashboard", // Title for user dashboard  
          parkingLots, // Pass parking lots data  
          userId, // Pass user ID to the dashboard  
          name, 
          errorMessage,  
          successMessage,// Pass the user name  
        });  
      }  
    } catch (error) {  
      console.error("Error fetching parking lots:", error);  
      res.render("error", {  
        message: "Error fetching parking lots", // Render a general error page  
        error: error.message,  
      });  
    }  
  };
