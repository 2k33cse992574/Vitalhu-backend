// controllers/exerciseController.js

const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'searchTerm is required' });
    }

    try {
        let plan;

        if (isPainProblem(searchTerm)) {
            plan = aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');
        } else {
            plan = aiHelper.generateExercisePlan(searchTerm, category, req.user.id);
        }

        const newExercise = new Exercise({
            user: req.user.id,
            title: plan.title || searchTerm,
            category: plan.category || 'pain-relief',
            instructions: plan.instructions || []
        });

        await newExercise.save();

        res.json(plan);
    } catch (err) {
        console.error('Error in getExercise:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

function isPainProblem(term) {
    const painKeywords = [
        'back pain', 'neck pain', 'knee pain', 'shoulder pain', 'lower back', 'hip pain', 'wrist pain'
    ];
    return painKeywords.some(keyword => term.toLowerCase().includes(keyword));
}
