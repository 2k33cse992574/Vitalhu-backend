// controllers/exerciseController.js

const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

exports.getExercise = async (req, res) => {
    const { searchTerm, category, language } = req.body;

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'searchTerm is required' });
    }

    try {
        let exercises = [];

        if (isPainProblem(searchTerm)) {
            // Map pain to multiple targeted exercises
            exercises = getPainReliefExercises(searchTerm, language || 'en');
        } else {
            // Search database for matching exercise
            exercises = await Exercise.find({
                title: { $regex: searchTerm, $options: "i" }
            });

            // If no DB match, try AI to generate it
            if (exercises.length === 0) {
                const aiPlan = await aiHelper.generateExercisePlan(searchTerm, category, req.user.id);
                exercises.push({
                    title: aiPlan.title || searchTerm,
                    category: aiPlan.category || category || 'general',
                    instructions: aiPlan.instructions || []
                });
            }
        }

        // Save each exercise in DB for progress tracking
        for (const e of exercises) {
            await new Exercise({
                user: req.user.id,
                title: e.title,
                category: e.category || 'general',
                instructions: e.instructions || []
            }).save();
        }

        res.json(exercises);
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

function getPainReliefExercises(term, language) {
    const painMap = {
        'back pain': [
            { title: 'Cat-Cow Stretch', category: 'yoga', instructions: ['Start on all fours...', 'Arch and round your back slowly.'] },
            { title: 'Child’s Pose', category: 'yoga', instructions: ['Sit back on heels...', 'Stretch arms forward.'] },
            { title: 'Pelvic Tilt', category: 'strength', instructions: ['Lie on your back...', 'Tilt pelvis upward.'] }
        ],
        'neck pain': [
            { title: 'Neck Side Stretch', category: 'stretching', instructions: ['Tilt head to one side...', 'Hold 20 seconds each side.'] },
            { title: 'Chin Tucks', category: 'strength', instructions: ['Sit upright...', 'Pull chin straight back.'] },
            { title: 'Shoulder Rolls', category: 'mobility', instructions: ['Roll shoulders backward and forward.'] }
        ],
        'knee pain': [
            { title: 'Quad Stretch', category: 'stretching', instructions: ['Stand and hold ankle...', 'Pull toward glutes.'] },
            { title: 'Hamstring Stretch', category: 'stretching', instructions: ['Sit with legs straight...', 'Reach forward.'] },
            { title: 'Straight Leg Raise', category: 'strength', instructions: ['Lie on your back...', 'Lift one leg straight up.'] }
        ],
        'shoulder pain': [
            { title: 'Pendulum Swing', category: 'mobility', instructions: ['Lean forward...', 'Swing arm gently in circles.'] },
            { title: 'Wall Angels', category: 'mobility', instructions: ['Stand against wall...', 'Slide arms up and down.'] },
            { title: 'Cross-Body Stretch', category: 'stretching', instructions: ['Pull one arm across chest...', 'Hold for 20 seconds.'] }
        ]
    };

    // Default to a safe routine if no direct match
    const foundPain = Object.keys(painMap).find(p => term.toLowerCase().includes(p));
    return painMap[foundPain] || [
        { title: 'Gentle Stretching', category: 'yoga', instructions: ['Stretch slowly...', 'Breathe deeply.'] }
    ];
}
