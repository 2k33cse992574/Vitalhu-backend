const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

// Known exercises (for exact exercise detection)
const KNOWN_EXERCISES = [
    'push ups', 'push-up', 'pushups',
    'plank', 'squats', 'burpees', 'lunges',
    'pull ups', 'pull-up', 'running', 'jogging',
    'cycling', 'bench press', 'deadlift', 'yoga',
    'stretching', 'zumba', 'jump rope'
];

// Pain keywords
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
        // PAIN SEARCH → return 2–3 unique exercises
        // =========================
        if (isPainProblem(queryLower) && !isKnownExercise(queryLower)) {
            let plans = await aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');

            // Ensure array
            plans = Array.isArray(plans) ? plans : [plans];

            // Limit to 3 unique exercises
            const exercises = [];
            const titles = new Set();
            for (const ex of plans) {
                if (!titles.has(ex.title) && exercises.length < 3) {
                    titles.add(ex.title);
                    const saved = await new Exercise({
                        user: req.user.id,
                        title: ex.title,
                        category: ex.category || 'pain-relief',
                        instructions: ex.instructions || []
                    }).save();
                    exercises.push(saved);
                }
            }

            return res.json(exercises);
        }

        // =========================
        // EXERCISE SEARCH → return single exercise with instructions/posture
        // =========================
        let exercise = await Exercise.findOne({
            title: { $regex: `^${searchTerm}$`, $options: "i" }
        });

        if (!exercise) {
            // fallback partial match
            exercise = await Exercise.findOne({
                title: { $regex: searchTerm, $options: "i" }
            });
        }

        if (exercise) {
            return res.json(exercise); // single exercise
        }

        // =========================
        // AI fallback for exercise
        // =========================
        const aiPlan = await aiHelper.generateExercisePlan(
            searchTerm,
            category,
            req.user.id,
            true // strict mode → ensures correct exercise
        );

        const newExercise = new Exercise({
            user: req.user.id,
            title: aiPlan.title || searchTerm,
            category: aiPlan.category || category || 'general',
            instructions: aiPlan.instructions || []
        });

        await newExercise.save();

        return res.json(newExercise);

    } catch (err) {
        console.error('Error in getExercise:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helpers
function isPainProblem(term) {
    return PAIN_KEYWORDS.some(keyword => term.includes(keyword));
}

function isKnownExercise(term) {
    return KNOWN_EXERCISES.some(ex => term === ex || term.includes(ex));
}
