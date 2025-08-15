// controllers/exerciseController.js

const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language } = req.body;

    // Validate input
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'searchTerm is required' });
    }

    try {
        // =========================
        // Pain problem search flow
        // =========================
        if (isPainProblem(searchTerm)) {
            const plan = await aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');

            // Ensure we always have an array
            const exercises = Array.isArray(plan) ? plan : [plan];

            // Save each pain-relief exercise for the user
            for (const ex of exercises) {
                await new Exercise({
                    user: req.user.id,
                    title: ex.title || searchTerm,
                    category: ex.category || 'pain-relief',
                    instructions: ex.instructions || []
                }).save();
            }

            return res.json(exercises);
        }

        // =========================
        // Standard exercise search flow
        // =========================

        // 1. Exact match from DB
        let exercises = await Exercise.find({
            title: { $regex: `^${searchTerm}$`, $options: "i" }
        });

        // 2. Fallback: partial match from DB
        if (exercises.length === 0) {
            exercises = await Exercise.find({
                title: { $regex: searchTerm, $options: "i" }
            });
        }

        // 3. If found in DB, return results
        if (exercises.length > 0) {
            return res.json(exercises);
        }

        // 4. AI fallback: force it to return only that exercise
        const aiPlan = await aiHelper.generateExercisePlan(
            searchTerm,
            category,
            req.user.id,
            true // strict mode if supported
        );

        const newExercise = {
            title: aiPlan.title || searchTerm,
            category: aiPlan.category || category || 'general',
            instructions: aiPlan.instructions || []
        };

        // Save AI-generated exercise for this user
        await new Exercise({
            user: req.user.id,
            ...newExercise
        }).save();

        return res.json([newExercise]);

    } catch (err) {
        console.error('Error in getExercise:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper to detect pain-related terms
function isPainProblem(term) {
    const painKeywords = [
        'back pain', 'neck pain', 'knee pain', 'shoulder pain',
        'lower back', 'hip pain', 'wrist pain'
    ];
    return painKeywords.some(keyword => term.toLowerCase().includes(keyword));
}
