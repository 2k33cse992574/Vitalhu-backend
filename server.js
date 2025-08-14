// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const progressRoutes = require('./routes/progress');
const exerciseRoutes = require('./routes/exercise');
// const painReliefRoutes = require('./routes/painRelief'); // Removed
const nutritionRoutes = require('./routes/nutrition');
const postureRoutes = require('./routes/posture');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/progress', progressRoutes);
app.use('/exercise', exerciseRoutes);
// app.use('/pain-relief', painReliefRoutes); // Removed
app.use('/nutrition', nutritionRoutes);
app.use('/posture-check', postureRoutes);
app.use('/notifications', notificationRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('AI Fitness Backend is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
