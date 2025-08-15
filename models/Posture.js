const mongoose = require('mongoose');

const PostureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'en'
    },
    postureData: {
        type: Object,  // Can store raw pose points or angles
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Posture', PostureSchema);
