const jwt = require('jsonwebtoken');
require('dotenv').config();

// This function acts as a "gatekeeper"
module.exports = (req, res, next) => {
    // 1. Get the token from the request header
    const token = req.header('Authorization');

    // 2. If no token is found, block access
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // 3. If token starts with "Bearer ", remove that part to get just the string
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        // 4. Verify the token using your secret key
        const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
        
        // 5. Add the user data (id, role) to the request object
        req.user = verified;

        // 6. Go to the next step (the actual product logic)
        next();
    } catch (err) {
        // 7. If token is fake or expired, send error
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};