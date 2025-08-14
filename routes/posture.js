// routes/posture.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkPosture } = require('../controllers/postureController');

router.post('/', auth, checkPosture);

module.exports = router;
