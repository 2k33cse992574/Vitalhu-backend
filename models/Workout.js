const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  avgPostureScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  feedback: {
    title: { type: String, required: true, default: 'Workout Feedback' },
    instructions: { type: [String], default: [] }
  },
  language: {
    type: String,
    default: 'en'
  },
  workoutData: {
    type: mongoose.Schema.Types.Mixed, // stores raw keypoints / AI data
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
