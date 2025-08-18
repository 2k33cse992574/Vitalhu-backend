const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

const PAIN_KEYWORDS = [
    'back pain', 'neck pain', 'knee pain', 'shoulder pain',
    'lower back', 'hip pain', 'wrist pain', 'ankle pain',
    'elbow pain', 'leg pain', 'foot pain'
];

exports.getExercise = async (req, res) => {
    const { searchTerm, language = 'en' } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'searchTerm is required' });
    }

    try {
        // 1️⃣ Check if exercise exists in DB
        let exercise = await Exercise.findOne({
            title: { $regex: `^${searchTerm}$`, $options: 'i' }
        });

        if (exercise) {
            return res.json({
                ...exercise.toObject(),
                postureLink: `/posture/${exercise.postureId || exercise._id}`
            });
        }

        // 2️⃣ Generate exercise dynamically using AI
        const aiPlan = await aiHelper.generateExercisePlan(searchTerm, null, req.user?.id);
        const firstExercise = Array.isArray(aiPlan.routine) ? aiPlan.routine[0] : aiPlan.routine;
        const exerciseDetails = await aiHelper.getExerciseById(firstExercise?.id) || {};

        // 3️⃣ Save AI-generated exercise in DB for caching
        const newExercise = await new Exercise({
            user: req.user?.id,
            title: firstExercise?.title || searchTerm,
            description: firstExercise?.description || exerciseDetails.description || 'Follow proper form',
            duration: firstExercise?.duration || exerciseDetails.duration || 10,
            category: aiPlan.category || 'general',
            instructions: firstExercise?.instructions || ['Follow proper form'],
            postureId: firstExercise?.id || searchTerm.toLowerCase().replace(/\s+/g, '-'),
            benefits: exerciseDetails.benefits || []
        }).save();

        // 4️⃣ Return exercise info
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

        // Generate exercises dynamically using AI
        const aiPlan = await aiHelper.generateExercisePlan(null, category);

        const exercises = Array.isArray(aiPlan.routine)
            ? aiPlan.routine
            : [aiPlan.routine];

        // Optionally, save generated exercises in DB for caching
        const savedExercises = await Promise.all(
            exercises.map(async (ex) => {
                const existing = await Exercise.findOne({ title: ex.title });
                if (existing) return existing;

                const exerciseDetails = await aiHelper.getExerciseById(ex.id) || {};

                return await new Exercise({
                    user: req.user?.id,
                    title: ex.title,
                    description: ex.description || exerciseDetails.description || 'Follow proper form',
                    duration: ex.duration || exerciseDetails.duration || 10,
                    category: category.toLowerCase(),
                    instructions: ex.instructions || ['Follow proper form'],
                    postureId: ex.id,
                    benefits: exerciseDetails.benefits || []
                }).save();
            })
        );

        // Return exercises with postureLink
        const response = savedExercises.map(ex => ({
            ...ex.toObject(),
            postureLink: `/posture/${ex.postureId || ex._id}`
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
