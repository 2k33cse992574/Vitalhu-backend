// models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        default: ''
    },
    category: { 
        type: String, 
        enum: ['yoga', 'strength', 'cardio', 'pain-relief', 'general'],
        default: 'general' 
    },
    duration: {
        type: String,
        default: '5 min'
    },
    instructions: { 
        type: [String], 
        default: [] 
    },
    benefits: {
        type: [String],
        default: []
    },
    postureId: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for posture link
ExerciseSchema.virtual('postureLink').get(function() {
    return `/posture/${this.postureId}`;
});

module.exports = mongoose.model('Exercise', ExerciseSchema);