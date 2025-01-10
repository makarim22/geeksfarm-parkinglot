const express = require('express');  
const bodyParser = require('body-parser');  
const session = require('express-session'); 
 
const path = require('path');  

const sequelize = require('./config/database');  
// const cron = require('node-cron');  
const cookieParser = require('cookie-parser');


//
const morgan = require('morgan'); 
const fs = require('fs'); 
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//
/// define routes
const authRoutes = require('./routes/authRoutes');  
const parkingRoutes = require('./routes/parkingRoutes');  
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const homeRoutes = require('./routes/homeRoutes');  
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const {isAdmin} = require ('./middleware/authmiddleware2')
const errorHandler = require('./middleware/errorHandler');    
const cors = require('cors');  
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 3000;  



// Setup session middleware  
app.use(session({  
    secret: '221998', // Replace with a strong secret key  
    resave: false,  
    saveUninitialized: true,  
    cookie: { secure: false } // Set to true in production with HTTPS  
}));  

// Other middlewares and routes...
app.use(cookieParser()); 
// Middleware  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());  
app.use(express.json());  
app.use(cors());  

app.set('view engine', 'ejs');  
app.set('views', './views');  

//
app.use(morgan('combined', { stream: accessLogStream }));  
app.use(morgan('dev'));
// //
// Routes  
app.use('/', homeRoutes);  
app.use('/', authRoutes); // Add the authentication routes  
app.use('/', dashboardRoutes); // Add dashboard routes here   
app.use('/', parkingRoutes);  
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', bookingRoutes); 
app.use('/', profileRoutes);
// app.use('/', ticketRoutes);  
app.use('/', userRoutes);// Add the profile routes here 

app.use(express.static('public'));
// sequelize.sync({ alter: true }); // This will adjust the models to match the database schema

app.use(errorHandler);  
app.use((err, req, res, next) => {  
    console.error(err.stack); // Log the stack trace for debugging  
    res.status(500).render('error', { message: 'An error occurred' }); // Render a generic error page  
});  
// Start the server  
app.listen(PORT, async () => {  
    try {  
        await sequelize.authenticate();  
        console.log(`Server is running on http://localhost:${PORT}`);  
    } catch (error) {  
        console.error('Unable to connect to the database:', error);  
    }  
});
 
