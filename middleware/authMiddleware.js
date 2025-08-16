// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    // 1. Extract token from headers (case-insensitive)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log("🔹 Auth Header:", authHeader || 'Not found');

    if (!authHeader) {
        console.warn("❌ No auth header");
        return res.status(401).json({ 
            success: false,
            message: 'Authorization token required' 
        });
    }

    // 2. Extract raw token (supports "Bearer <token>" and raw tokens)
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;
    
    if (!token) {
        console.warn("❌ Empty token");
        return res.status(401).json({ 
            success: false,
            message: 'Malformed authorization token' 
        });
    }
    console.log("🔹 Extracted Token:", token);

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Token:", decoded);

        // 4. Attach user to request (either from token or DB)
        req.user = decoded.user || await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            console.warn("❌ User not found");
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        console.log(`✅ Authenticated User: ${req.user._id}`);
        next();

    } catch (err) {
        console.error("❌ JWT Error:", err.message);
        
        const message = err.name === 'JsonWebTokenError' 
            ? 'Invalid token' 
            : 'Session expired';
            
        res.status(401).json({ 
            success: false,
            message 
        });
    }
};