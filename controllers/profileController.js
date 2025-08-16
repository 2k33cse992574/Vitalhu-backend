const User = require('../models/User');

// Get user profile (aligned with frontend fields)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v -healthConditions -language');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            name: user.name,
            age: user.age,
            height: user.height,
            weight: user.weight,
            bmi: user.bmi,
            goals: user.goals,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update profile (supports partial updates)
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Selective updates
        const updatableFields = ['name', 'age', 'height', 'weight', 'goals'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'goals') {
                    user.goals = { ...user.goals, ...req.body.goals };
                } else {
                    user[field] = req.body[field];
                }
            }
        });

        await user.save();
        res.json({
            name: user.name,
            age: user.age,
            height: user.height,
            weight: user.weight,
            bmi: user.bmi,
            goals: user.goals
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};