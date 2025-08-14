
const mongoose = require('mongoose');

const PainReliefSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: String, required: true },
    instructions: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PainRelief', PainReliefSchema);
