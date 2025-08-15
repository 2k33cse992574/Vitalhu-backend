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
    'lower back','hip pain','wrist pain','ankle pain','elbow pain','leg pain','foot pain'
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
            const exercises = aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');

            const savedExercises = [];
            for (const ex of exercises) {
                const saved = await new Exercise({
                    user: req.user.id,
                    title: ex.title,
                    category: 'pain-relief',
                    instructions: ex.instructions
                }).save();
                savedExercises.push(saved);
            }

            return res.json(savedExercises); // returns array of exercises
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
        // AI fallback for unknown exercise
        // =========================
        const aiPlan = aiHelper.generateExercisePlan(searchTerm, category, req.user.id);

        const newExercise = new Exercise({
            user: req.user.id,
            title: aiPlan.title || searchTerm,
            category: aiPlan.category || category || 'general',
            instructions: aiPlan.routine || []
        });

        await newExercise.save();
        return res.json(newExercise);

    } catch (err) {
        console.error('Error in getExercise:', err);
        res.status(500).json({ message: 'Server error' });
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
