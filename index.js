const express = require('express');  
const bodyParser = require('body-parser');  
const session = require('express-session'); 
const PgSession = require('connect-pg-simple')(session);
 
const path = require('path');  

const sequelize = require('./config/database');  
// const cron = require('node-cron');  
const cookieParser = require('cookie-parser');


//
const morgan = require('morgan'); 
const fs = require('fs'); 

// Only create file stream in development (not on Vercel)
let accessLogStream;
if (process.env.NODE_ENV !== 'production') {
  accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
}

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
const PORT = process.env.PORT || 3004;  



// Setup session middleware with PostgreSQL store
app.use(session({  
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session' // PostgreSQL will store sessions in this table
    }),
    secret: process.env.SESSION_SECRET || '221998', // Use environment variable in production
    resave: false,  
    saveUninitialized: false,  // Changed to false for privacy (only create session when needed)
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // true over HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
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
// Only use file-based access logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: accessLogStream }));
}
app.use(morgan('dev')); // Always log to console
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
