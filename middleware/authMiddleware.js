const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Log incoming header for debugging
    console.log("🔹 Incoming Authorization Header:", req.header('Authorization'));

    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract the token part
    const token = authHeader.split(' ')[1];
    console.log("🔹 Extracted Token:", token);

    try {
        // Verify the token
        console.log("🔹 Using JWT_SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Payload:", decoded);

        // Ensure user object always has 'id'
        if (decoded.user && decoded.user._id && !decoded.user.id) {
            decoded.user.id = decoded.user._id;
        }

        req.user = decoded.user;
        console.log("✅ Authenticated User ID:", req.user.id || req.user._id);
        next();
    } catch (err) {
        console.error("❌ JWT Verification Error:", err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
