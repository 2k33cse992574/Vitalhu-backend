const aiHelper = require('../utils/aiHelper');
const Posture = require('../models/Posture');

/**
 * @desc Analyze posture and save feedback
 * @route POST /api/posture
 * @access Private
 */
exports.checkPosture = async (req, res) => {
    const { postureData, language } = req.body;

    if (!postureData) {
        return res.status(400).json({ message: 'Posture data is required' });
    }

    try {
        // 1. Analyze posture using AI helper
        const feedback = aiHelper.analyzePosture(postureData, language || 'en');

        // 2. Save result to database
        const newPosture = new Posture({
            user: req.user.id,
            feedback,
            language: language || 'en',
            postureData
        });

        await newPosture.save();

        // 3. Send response back to client
        res.json({
            message: 'Posture analyzed successfully',
            feedback,
            createdAt: newPosture.createdAt
        });

    } catch (err) {
        console.error('Posture analysis error:', err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc Get all posture feedback history for logged-in user
 * @route GET /api/posture
 * @access Private
 */
exports.getPostureHistory = async (req, res) => {
    try {
        const history = await Posture.find({ user: req.user.id })
            .select('feedback language postureData createdAt')
            .sort({ createdAt: -1 }); // latest first

        res.json(history);
    } catch (err) {
        console.error('Fetch posture history error:', err.message);
        res.status(500).send('Server error');
    }
};
