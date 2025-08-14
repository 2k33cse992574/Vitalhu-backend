const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProgress, addProgress, updateProgress, deleteProgress } = require('../controllers/progressController');

// GET /progress → Get all progress entries for logged-in user
router.get('/', auth, getProgress);

// POST /progress → Add a new progress entry
router.post('/', auth, addProgress);

// PUT /progress/:id → Update a progress entry
router.put('/:id', auth, updateProgress);

// DELETE /progress/:id → Delete a progress entry
router.delete('/:id', auth, deleteProgress);

module.exports = router;
