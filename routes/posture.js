const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkPosture, getPostureHistory } = require('../controllers/postureController');

// POST → analyze posture and save feedback
router.post('/', auth, checkPosture);

// GET → fetch posture feedback history
router.get('/', auth, getPostureHistory);

module.exports = router;
