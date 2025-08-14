const aiHelper = require('../utils/aiHelper');
const Exercise = require('../models/Exercise');

exports.getExercise = async (req, res) => {
    const { searchTerm, category } = req.body; // searchTerm can be pain or exercise name

    try {
        // Generate AI exercise plan
        const exercisePlan = aiHelper.generateExercisePlan(searchTerm, category, req.user.id);

        // Optionally save in Exercise history
        const newExercise = new Exercise({
            user: req.user.id,
            title: exercisePlan.title,
            category: exercisePlan.category
        });
        await newExercise.save();

        res.json(exercisePlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
