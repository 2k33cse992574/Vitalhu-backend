const Notification = require('../models/Notification');

// GET all notifications for logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            user: req.user.id, 
            title: { $exists: true }, 
            time: { $exists: true } 
        })
        .sort({ createdAt: -1 })
        .select('title time createdAt'); // only return necessary fields

        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).send('Server error');
    }
};



// POST a new notification
exports.createNotification = async (req, res) => {
    const { title, time } = req.body;

    if (!title || !time) {
        return res.status(400).json({ message: 'Title and time are required' });
    }

    try {
        const newNotification = new Notification({
            user: req.user.id,
            title,
            time
        });
        await newNotification.save();

        // Return clean JSON response
        res.json({
            title: newNotification.title,
            time: newNotification.time,
            createdAt: newNotification.createdAt
        });
    } catch (err) {
        console.error('Error saving notification:', err.message);
        res.status(500).send('Server error');
    }
};
