const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token format (usually "Bearer <token>")
        const actualToken = token.split(' ')[1];
        
        // Decode the token using our secret key
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // Attach the user's ID to the request so the next function can use it
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};