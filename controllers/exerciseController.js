const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

// Known common exercises for better detection
const KNOWN_EXERCISES = [
    'push ups', 'push-up', 'pushups',
    'plank', 'squats', 'burpees', 'lunges',
    'pull ups', 'pull-up', 'running', 'jogging',
    'cycling', 'bench press', 'deadlift', 'yoga',
    'stretching', 'zumba', 'jump rope'
];

// Pain-related keywords
const PAIN_KEYWORDS = [
    'back pain', 'neck pain', 'knee pain', 'shoulder pain',
    'lower back', 'hip pain', 'wrist pain', 'ankle pain',
    'elbow pain', 'leg pain', 'foot pain'
];

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'searchTerm is required' });
    }

    try {
        const queryLower = searchTerm.toLowerCase();

        // =========================
        // PAIN SEARCH
        // =========================
        if (isPainProblem(queryLower) && !isKnownExercise(queryLower)) {
            const plan = await aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');
            const exercises = Array.isArray(plan) ? plan : [plan];

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
        // EXERCISE SEARCH
        // =========================
        let exercises = await Exercise.find({
            title: { $regex: `^${searchTerm}$`, $options: "i" }
        });

        if (exercises.length === 0) {
            exercises = await Exercise.find({
                title: { $regex: searchTerm, $options: "i" }
            });
        }

        if (exercises.length > 0) {
            return res.json(exercises);
        }

        // AI fallback — force specific exercise
        const aiPlan = await aiHelper.generateExercisePlan(
            searchTerm,
            category,
            req.user.id,
            true // strict mode
        );

        const newExercise = {
            title: aiPlan.title || searchTerm,
            category: aiPlan.category || category || 'general',
            instructions: aiPlan.instructions || []
        };

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

function isPainProblem(term) {
    return PAIN_KEYWORDS.some(keyword => term.includes(keyword));
}

function isKnownExercise(term) {
    return KNOWN_EXERCISES.some(ex => term === ex || term.includes(ex));
}
