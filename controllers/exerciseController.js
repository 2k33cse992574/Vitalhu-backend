// controllers/exerciseController.js
const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

const KNOWN_EXERCISES = [
    'push ups','push-up','pushups',
    'plank','squats','burpees','lunges',
    'pull ups','pull-up','running','jogging',
    'cycling','bench press','deadlift','yoga',
    'stretching','zumba','jump rope'
];

const PAIN_KEYWORDS = [
    'back pain','neck pain','knee pain','shoulder pain',
    'lower back','hip pain','wrist pain','ankle pain',
    'elbow pain','leg pain','foot pain'
];

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'searchTerm is required' });
    }

    try {
        const queryLower = searchTerm.toLowerCase();

        // =========================
        // PAIN SEARCH → 2–3 unique exercises
        // =========================
        if (isPainProblem(queryLower) && !isKnownExercise(queryLower)) {
            // Await AI helper in case it’s async
            const exercises = await aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');

            // Ensure it's always an array
            const exercisesArray = Array.isArray(exercises) ? exercises : [exercises];

            const savedExercises = [];
            for (const ex of exercisesArray) {
                const saved = await new Exercise({
                    user: req.user?.id,       // Safe optional chaining
                    title: ex.title || 'Pain Relief Exercise',
                    category: 'pain-relief',
                    instructions: Array.isArray(ex.instructions) ? ex.instructions : [ex.instructions || 'Follow instructions']
                }).save();
                savedExercises.push(saved);
            }

            return res.json(savedExercises);
        }

        // =========================
        // EXERCISE SEARCH → single exercise
        // =========================
        let exercise = await Exercise.findOne({
            title: { $regex: `^${searchTerm}$`, $options: 'i' }
        });

        if (!exercise) {
            exercise = await Exercise.findOne({
                title: { $regex: searchTerm, $options: 'i' }
            });
        }

        if (exercise) return res.json(exercise);

        // =========================
        // AI fallback for exercise
        // =========================
        const aiPlan = await aiHelper.generateExercisePlan(searchTerm, category, req.user?.id);

        // Map AI plan to Exercise schema fields
        const newExercise = new Exercise({
            user: req.user?.id,
            title: aiPlan.title || searchTerm,
            category: aiPlan.category || category || 'general',
            instructions: Array.isArray(aiPlan.routine) ? aiPlan.routine : [aiPlan.routine || 'Follow instructions']
        });

        await newExercise.save();
        return res.json(newExercise);

    } catch (err) {
        console.error('Error in getExercise:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// =========================
// Helpers
// =========================
function isPainProblem(term) {
    return PAIN_KEYWORDS.some(k => term.includes(k));
}

function isKnownExercise(term) {
    return KNOWN_EXERCISES.some(ex => term === ex || term.includes(ex));
}
