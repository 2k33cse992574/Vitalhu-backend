const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    healthConditions: { type: [String] },
    language: { type: String, default: 'en' }, // en or hi
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
