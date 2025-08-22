const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkWorkout, getWorkoutHistory } = require('../controllers/workoutController');

// POST → analyze workout data and save feedback
router.post('/', auth, checkWorkout);

// GET → fetch workout history
router.get('/', auth, getWorkoutHistory);

module.exports = router;
