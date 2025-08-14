const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkPosture } = require('../controllers/postureController');

// POST /posture-check → analyze camera/posture data
router.post('/', auth, checkPosture);

module.exports = router;
