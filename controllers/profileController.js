const User = require('../models/User');

// GET user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // exclude password
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// PUT update profile
exports.updateProfile = async (req, res) => {
    const { name, age, healthConditions, language } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields
        if (name) user.name = name;
        if (age) user.age = age;
        if (healthConditions) user.healthConditions = healthConditions;
        if (language) user.language = language;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
