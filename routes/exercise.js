// routes/exercise.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getExercise } = require('../controllers/exerciseController');

router.post('/', auth, getExercise);

module.exports = router;
