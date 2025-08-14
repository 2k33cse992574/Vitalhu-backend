const aiHelper = require('../utils/aiHelper');
const PainRelief = require('../models/PainRelief');

exports.getPainRelief = async (req, res) => {
    const { exerciseName, language } = req.body;

    // Validate input
    if (!exerciseName || exerciseName.trim() === '') {
        return res.status(400).json({ message: 'exerciseName is required' });
    }

    // Ensure user ID exists
    if (!req.user || !req.user.id) {
        console.error('User ID missing in request:', req.user);
        return res.status(401).json({ message: 'User not authenticated properly' });
    }

    let routine;
    try {
        routine = aiHelper.generatePainReliefRoutine(exerciseName, language || 'en');

        if (!routine || !Array.isArray(routine.instructions)) {
            console.error('AI Helper returned invalid routine:', routine);
            return res.status(500).json({ message: 'Invalid AI routine generated' });
        }
    } catch (err) {
        console.error('AI Helper error:', err);
        return res.status(500).json({ message: 'Error generating AI routine' });
    }

    try {
        // Save history in database
        const newPainRelief = new PainRelief({
            user: req.user.id,               // pass string ID directly
            exercise: exerciseName,
            instructions: routine.instructions
        });

        await newPainRelief.save();
    } catch (err) {
        console.error('Database save error:', err);
        return res.status(500).json({ message: 'Failed to save routine in database' });
    }

    // Respond with routine
    res.json(routine);
};
