const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    category: { type: String }, // yoga, strength, cardio
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
