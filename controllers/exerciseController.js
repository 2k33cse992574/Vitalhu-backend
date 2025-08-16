// controllers/exerciseController.js
const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

const PAIN_KEYWORDS = [
    'back pain', 'neck pain', 'knee pain', 'shoulder pain',
    'lower back', 'hip pain', 'wrist pain', 'ankle pain',
    'elbow pain', 'leg pain', 'foot pain'
];

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language = 'en' } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'searchTerm is required' });
    }

    try {
        const queryLower = searchTerm.toLowerCase();

        // =========================
        // 1. Handle Pain Search (returns 2-3 exercises)
        // =========================
        if (isPainProblem(queryLower)) {
            const painExercises = await aiHelper.generatePainReliefRoutine(searchTerm, language);
            
            // Save and return the pain relief exercises
            const savedExercises = await Promise.all(
                painExercises.map(async (ex) => {
                    const exerciseDetails = await aiHelper.getExerciseById(ex.id) || {};
                    return await new Exercise({
                        user: req.user?.id,
                        title: ex.title,
                        description: ex.description || exerciseDetails.description,
                        duration: ex.duration || exerciseDetails.duration,
                        category: 'pain-relief',
                        instructions: ex.instructions,
                        postureId: ex.id,
                        benefits: exerciseDetails.benefits || []
                    }).save();
                })
            );

            return res.json({
                type: 'pain-relief',
                pain: searchTerm,
                exercises: savedExercises
            });
        }

        // =========================
        // 2. Handle Category Tab Click (direct to posture)
        // =========================
        if (category && ['yoga', 'strength', 'cardio'].includes(category.toLowerCase())) {
            const categoryExercises = await aiHelper.generateExercisePlan(null, category);
            const postureExercises = categoryExercises.routine.map(ex => ({
                ...ex,
                postureLink: `/posture/${ex.id}`
            }));

            return res.json({
                type: 'category',
                category,
                exercises: postureExercises
            });
        }

        // =========================
        // 3. Handle Exercise Search (single exercise)
        // =========================
        // First try exact match
        let exercise = await Exercise.findOne({
            title: { $regex: `^${searchTerm}$`, $options: 'i' }
        });

        // Then try partial match
        if (!exercise) {
            exercise = await Exercise.findOne({
                title: { $regex: searchTerm, $options: 'i' }
            });
        }

        // If found in DB, return with posture link
        if (exercise) {
            return res.json({
                ...exercise.toObject(),
                postureLink: `/posture/${exercise.postureId || exercise._id}`
            });
        }

        // =========================
        // 4. AI Fallback for new exercises
        // =========================
        const aiPlan = await aiHelper.generateExercisePlan(searchTerm, category, req.user?.id);
        const firstExercise = Array.isArray(aiPlan.routine) ? aiPlan.routine[0] : aiPlan.routine;
        const exerciseDetails = await aiHelper.getExerciseById(firstExercise?.id) || {};

        const newExercise = await new Exercise({
            user: req.user?.id,
            title: firstExercise?.title || searchTerm,
            description: firstExercise?.description || exerciseDetails.description,
            duration: firstExercise?.duration || exerciseDetails.duration,
            category: aiPlan.category || category || 'general',
            instructions: firstExercise?.instructions || ['Follow proper form'],
            postureId: firstExercise?.id,
            benefits: exerciseDetails.benefits || []
        }).save();

        return res.json({
            ...newExercise.toObject(),
            postureLink: `/posture/${newExercise.postureId || newExercise._id}`
        });

    } catch (err) {
        console.error('Error in getExercise:', err);
        return res.status(500).json({ 
            error: 'Server error',
            message: err.message 
        });
    }
};

// =========================
// Tab Navigation Endpoint
// =========================
exports.getExercisesByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        if (!['yoga', 'strength', 'cardio'].includes(category.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const exercises = await aiHelper.generateExercisePlan(null, category);
        const response = exercises.routine.map(ex => ({
            ...ex,
            postureLink: `/posture/${ex.id}`
        }));

        return res.json({
            type: 'category',
            category,
            exercises: response
        });

    } catch (err) {
        console.error('Error in getExercisesByCategory:', err);
        return res.status(500).json({ 
            error: 'Server error',
            message: err.message 
        });
    }
};

// =========================
// Helper Functions
// =========================
function isPainProblem(term) {
    return PAIN_KEYWORDS.some(k => term.includes(k));
}