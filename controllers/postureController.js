const aiHelper = require('../utils/aiHelper');
const Posture = require('../models/Posture');

exports.checkPosture = async (req, res) => {
  const { postureData, language } = req.body;

  if (!postureData || typeof postureData !== 'object') {
    return res.status(400).json({ message: 'postureData (object) is required' });
  }

  try {
    const result = aiHelper.analyzePosture(postureData, language || 'en'); // { title, instructions }

    const newPosture = new Posture({
      user: req.user.id,
      feedback: {
        title: result.title,
        instructions: Array.isArray(result.instructions) ? result.instructions : []
      },
      language: (language || 'en').toLowerCase(),
      postureData
    });

    await newPosture.save();

    return res.json({
      message: 'Posture analyzed successfully',
      feedback: result,               // keep response shape same as before
      createdAt: newPosture.createdAt
    });
  } catch (err) {
    console.error('Posture save error:', err);
    return res.status(500).send('Server error');
  }
};

exports.getPostureHistory = async (req, res) => {
  try {
    const history = await Posture
      .find({ user: req.user.id })
      .select('feedback language postureData createdAt')
      .sort({ createdAt: -1 });

    return res.json(history);
  } catch (err) {
    console.error('Fetch posture history error:', err);
    return res.status(500).send('Server error');
  }
};
