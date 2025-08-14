const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    steps: { type: Number, default: 0 },
    painLevel: { type: Number, default: 0 },
    activity: { type: String } // optional description
});

module.exports = mongoose.model('Progress', ProgressSchema);
