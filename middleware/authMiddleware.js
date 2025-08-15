const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Try to read from Authorization header (case-insensitive)
    let authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log("🔹 Incoming Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Support both "Bearer <token>" and "<token>"
    let token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log("🔹 Extracted Token:", token);

    try {
        // Verify token with your secret
        console.log("🔹 Using JWT_SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Payload:", decoded);

        // Ensure req.user is set correctly
        if (decoded.user && decoded.user._id && !decoded.user.id) {
            decoded.user.id = decoded.user._id;
        }

        req.user = decoded.user;
        console.log("✅ Authenticated User:", req.user.id || req.user._id);
        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
