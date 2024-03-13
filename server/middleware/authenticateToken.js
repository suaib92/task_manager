// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            } else {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        req.user = decodedToken; // Assign decoded token to req.user
        next();
    });
};

module.exports = authenticateToken;
