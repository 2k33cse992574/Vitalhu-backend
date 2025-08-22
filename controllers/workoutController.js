const aiHelper = require('../utils/aiHelper');
const Workout = require('../models/Workout');

exports.checkWorkout = async (req, res) => {
  const { workoutData, language } = req.body;

  if (!workoutData || typeof workoutData !== 'object') {
    return res.status(400).json({ message: 'workoutData (object) is required' });
  }

  try {
    // analyzeWorkout should be implemented in aiHelper similar to analyzePosture
    const result = aiHelper.analyzeWorkout(workoutData, language || 'en'); 
    // result = { title, instructions } or any extra feedback your helper provides

    const newWorkout = new Workout({
      user: req.user.id,
      feedback: {
        title: result.title,
        instructions: Array.isArray(result.instructions) ? result.instructions : []
      },
      language: (language || 'en').toLowerCase(),
      workoutData // contains exercise, reps, posture score, calories, etc.
    });

    await newWorkout.save();

    return res.json({
      message: 'Workout analyzed successfully',
      feedback: result,               // keep same shape as before
      createdAt: newWorkout.createdAt
    });
  } catch (err) {
    console.error('Workout save error:', err);
    return res.status(500).send('Server error');
  }
};

exports.getWorkoutHistory = async (req, res) => {
  try {
    const history = await Workout
      .find({ user: req.user.id })
      .select('feedback language workoutData createdAt')
      .sort({ createdAt: -1 });

    return res.json(history);
  } catch (err) {
    console.error('Fetch workout history error:', err);
    return res.status(500).send('Server error');
  }
};
