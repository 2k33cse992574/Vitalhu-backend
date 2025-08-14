// models/Exercise.js

const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },          // exercise name or routine title
    category: { type: String, default: 'general' },   // yoga, strength, cardio, pain-relief
    instructions: { type: [String], default: [] },    // step-by-step instructions
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
