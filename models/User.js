const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    healthConditions: { type: [String] },
    language: { type: String, default: 'en' }, // en or hi
    goals: {
        steps: { type: Number, default: 0 },
        exerciseMinutes: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
