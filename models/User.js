const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6 
    },
    age: { 
        type: Number, 
        min: 13, 
        max: 120,
        default: null 
    },
    height: {  // in cm
        type: Number, 
        min: 100, 
        max: 250,
        default: null 
    },
    weight: {  // in kg
        type: Number, 
        min: 30, 
        max: 300,
        default: null 
    },
    bmi: {
        type: Number,
        min: 10,
        max: 50,
        default: null,
        set: v => v ? parseFloat(v.toFixed(1)) : null
    },
    goals: {
        steps: { type: Number, default: 0 },
        exerciseMinutes: { type: Number, default: 0 }
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        immutable: true 
    }
});

// Auto-calculate BMI on save
UserSchema.pre('save', function(next) {
    if ((this.isModified('height') || this.isModified('weight')) && this.height && this.weight) {
        this.bmi = parseFloat((this.weight / Math.pow(this.height / 100, 2)).toFixed(1));
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);