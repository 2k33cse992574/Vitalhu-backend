const mongoose = require('mongoose');

const PostureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feedback: {
    title: { type: String, required: true, default: 'Posture Feedback' },
    instructions: { type: [String], default: [] } // <-- array of strings
  },
  language: {
    type: String,
    default: 'en'
  },
  postureData: {
    type: mongoose.Schema.Types.Mixed, // safer than plain Object
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Posture', PostureSchema);
