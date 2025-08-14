const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// GET /profile → Get user profile
router.get('/', auth, getProfile);

// PUT /profile → Update user profile
router.put('/', auth, updateProfile);

module.exports = router;
