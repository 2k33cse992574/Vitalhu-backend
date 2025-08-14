const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getNutritionPlan } = require('../controllers/nutritionController');

// POST /nutrition → get diet plan
router.post('/', auth, getNutritionPlan);

module.exports = router;
