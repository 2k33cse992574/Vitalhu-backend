const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getExercise } = require('../controllers/exerciseController');

// POST /exercise → search term or category, returns exercise plan
router.post('/', auth, getExercise);

module.exports = router;
