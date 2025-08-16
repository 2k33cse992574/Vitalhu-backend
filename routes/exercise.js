// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    getExercise,
    getExercisesByCategory 
} = require('../controllers/exerciseController');

// Search exercises or pain relief
router.post('/', auth, getExercise);

// Get exercises by category (for tabs)
router.get('/category/:category', auth, getExercisesByCategory);

module.exports = router;