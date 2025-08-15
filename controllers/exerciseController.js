// controllers/exerciseController.js

const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

exports.getExercise = async (req, res) => {
    const { searchTerm = "", category = "", language = "en" } = req.body;

    try {
        let plan;

        // If searchTerm is empty → return all saved exercises for the user (optionally filter by category)
        if (searchTerm.trim() === "") {
            let query = { user: req.user.id };
            if (category) query.category = category;

            const allExercises = await Exercise.find(query).lean();
            return res.json(allExercises);
        }

        // If searchTerm matches a pain/problem keyword → generate pain relief routine
        if (isPainProblem(searchTerm)) {
            plan = aiHelper.generatePainReliefRoutine(searchTerm, language);
        } 
        // Otherwise → generate normal exercise plan
        else {
            plan = aiHelper.generateExercisePlan(searchTerm, category, req.user.id);
        }

        // Save the generated plan to DB
        const newExercise = new Exercise({
            user: req.user.id,
            title: plan.title || searchTerm,
            category: plan.category || category || 'general',
            instructions: plan.instructions || []
        });

        await newExercise.save();

        // Return the generated plan
        res.json(plan);

    } catch (err) {
        console.error('Error in getExercise:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

function isPainProblem(term) {
    const painKeywords = [
        'back pain', 'neck pain', 'knee pain', 'shoulder pain', 
        'lower back', 'hip pain', 'wrist pain'
    ];
    return painKeywords.some(keyword => term.toLowerCase().includes(keyword));
}
