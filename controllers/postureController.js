// controllers/postureController.js

const aiHelper = require('../utils/aiHelper');

exports.checkPosture = async (req, res) => {
    const { postureData, language } = req.body;

    try {
        const feedback = aiHelper.analyzePosture(postureData, language);
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
