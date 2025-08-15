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
            let exercises = await aiHelper.generatePainReliefRoutine(searchTerm, language || 'en');

            // Ensure array & take up to 3 unique exercises
            exercises = Array.isArray(exercises) ? exercises : [exercises];
            const uniqueExercises = [];
            const titles = new Set();
            for (const ex of exercises) {
                if (!titles.has(ex.title) && uniqueExercises.length < 3) {
                    titles.add(ex.title);
                    const saved = await new Exercise({
                        user: req.user.id,
                        title: ex.title,
                        category: ex.category || 'pain-relief',
                        instructions: ex.instructions || []
                    }).save();
                    uniqueExercises.push(saved);
                }
            }

            return res.json(uniqueExercises);
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

        // AI fallback
        const aiPlan = await aiHelper.generateExercisePlan(
            searchTerm,
            category,
            req.user.id,
            true
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

function isPainProblem(term) {
    return PAIN_KEYWORDS.some(k => term.includes(k));
}

function isKnownExercise(term) {
    return KNOWN_EXERCISES.some(ex => term === ex || term.includes(ex));
}
