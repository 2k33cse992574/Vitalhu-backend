const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getPainRelief } = require('../controllers/painReliefController');

// POST /pain-relief → get step-by-step routine
router.post('/', auth, getPainRelief);

module.exports = router;
