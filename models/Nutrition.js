const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dietPlan: { type: [String], default: [] },   // <- store array of strings
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Nutrition', NutritionSchema);
