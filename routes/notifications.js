const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getNotifications, createNotification } = require('../controllers/notificationsController');

// GET all notifications
router.get('/', auth, getNotifications);

// POST a new notification
router.post('/', auth, createNotification);

module.exports = router;
