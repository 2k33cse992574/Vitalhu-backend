const Progress = require('../models/Progress');

// GET user progress
exports.getProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user.id }).sort({ date: -1 });
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// POST add progress entry
exports.addProgress = async (req, res) => {
    const { steps, painLevel, activity } = req.body;

    try {
        const newEntry = new Progress({
            user: req.user.id,
            steps,
            painLevel,
            activity
        });

        await newEntry.save();
        res.json(newEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// PUT update progress entry
exports.updateProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ _id: req.params.id, user: req.user.id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });

        Object.assign(progress, req.body);
        await progress.save();

        res.json({ message: 'Progress updated successfully', progress });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

// DELETE progress entry
exports.deleteProgress = async (req, res) => {
    try {
        const progress = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });

        res.json({ message: 'Progress deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};
