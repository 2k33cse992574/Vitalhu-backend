const aiHelper = require('../utils/aiHelper');
const Nutrition = require('../models/Nutrition');

exports.getNutritionPlan = async (req, res) => {
    const { language } = req.body; // 'en' or 'hi'

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated properly' });
    }

    try {
        // Generate AI nutrition plan
        const nutritionPlan = await aiHelper.generateNutritionPlan(req.user.id, language || 'en');

        // Save diet plan history
        const newNutrition = new Nutrition({
            user: req.user.id,         // string ID is enough
            dietPlan: nutritionPlan.plan
        });
        await newNutrition.save();

        res.json(nutritionPlan);
    } catch (err) {
        console.error('Nutrition save error:', err.message);
        res.status(500).json({ message: 'Failed to save nutrition plan' });
    }
};
