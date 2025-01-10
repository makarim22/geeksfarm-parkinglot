const jwt = require('jsonwebtoken');  

exports.authenticateJWT = (req, res, next) => {  
    console.log('Authentication middleware hit'); 
    const token = req.cookies.token; // Retrieve the token from cookies  
    if (!token) {  
        return res.status(401).json({ message: 'Token missing' });  
    }  
    try {  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        req.userId = decoded.id; // Assuming your token payload contains 'id'  
        req.userRole = decoded.role; 
        req.username = decoded.username// Assuming your token payload contains 'role'  
        next(); // Proceed to the next middleware or route handler  
    } catch (error) {  
        console.error('Token verification error:', error);  
        return res.status(403).json({ message: 'Invalid or expired token' });  
    }  
};