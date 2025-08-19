const Exercise = require('../models/Exercise');

// ✅ Correct imports: destructure everything from aiHelper
const { generateExercisePlan, getExerciseById, ALL_EXERCISES, PAIN_EXERCISES, EXERCISES } = require('../utils/aiHelper');

const PAIN_KEYWORDS = [
  'back', 'back pain', 'lower back', 'upper back',
  'neck', 'neck pain', 'cervical pain',
  'knee', 'knee pain', 'patella pain',
  'shoulder', 'shoulder pain', 'rotator cuff',
  'hip', 'hip pain', 'pelvic pain',
  'wrist', 'wrist pain', 'carpal pain',
  'ankle', 'ankle pain', 'foot', 'foot pain', 'heel pain',
  'elbow', 'elbow pain', 'arm pain', 'leg', 'leg pain',
  'thigh pain', 'calf pain', 'hamstring pain'
];

const MAX_PAIN_EXERCISES = 3;

// =========================
// Get Exercise by Search Term
// =========================
exports.getExercise = async (req, res) => {
  const { searchTerm, language = 'en' } = req.body;

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({ error: 'searchTerm is required' });
  }

  try {
    const term = searchTerm.toLowerCase().trim();

    // --- CASE 1: Exact, partial, or keyword match ---
    let exercises = ALL_EXERCISES.filter(ex => {
      const title = ex.title.toLowerCase();
      const inTitle = title === term || title.includes(term);
      const inKeywords = ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(term));
      return inTitle || inKeywords;
    });

    if (exercises.length > 0) {
      const response = exercises.map(ex => ({
        ...ex,
        postureLink: `/posture/${ex.postureId || ex.id}`
      }));
      return res.json(response);
    }

    // --- CASE 2: Pain keyword match ---
    const painKeyword = PAIN_KEYWORDS.find(kw => term.includes(kw));
    if (painKeyword) {
      // force a normalized pain key (must exist in PAIN_EXERCISES)
      const painKey = Object.keys(PAIN_EXERCISES)
        .find(key => painKeyword.includes(key) || key.includes(painKeyword));

      if (painKey && PAIN_EXERCISES[painKey]) {
        const routine = PAIN_EXERCISES[painKey].slice(0, MAX_PAIN_EXERCISES); // limit 2–3
        const response = routine.map(ex => ({
          ...ex,
          category: 'pain-relief',
          postureLink: `/posture/${ex.id || ex.title.replace(/\s+/g,'-').toLowerCase()}`
        }));
        return res.json(response);
      }
    }

    // --- CASE 3: No match at all — return empty instead of Sun Salutation ---
    return res.json([]);

  } catch (err) {
    console.error('Error in getExercise:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};


// =========================
// Get Exercises by Category (for Tabs)
// =========================
exports.getExercisesByCategory = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {
    // ✅ Call helper directly, no aiHelper object needed
    const aiPlan = generateExercisePlan(null, category, req.user?.id);
    let exercises = Array.isArray(aiPlan.routine) ? aiPlan.routine : [aiPlan.routine];

    const savedExercises = await Promise.all(
      exercises.map(async (ex) => {
        const existing = await Exercise.findOne({ title: ex.title });
        if (existing) return existing;

        const details = getExerciseById(ex.id) || {};
        return await new Exercise({
          user: req.user?.id,
          title: ex.title,
          description: ex.description || details.description || 'Follow proper form',
          duration: ex.duration || details.duration || '10 min',
          category: category.toLowerCase(),
          instructions: ex.instructions || ['Follow proper form'],
          postureId: ex.id,
          benefits: details.benefits || []
        }).save();
      })
    );

    const response = savedExercises.map(ex => ({
      ...ex.toObject(),
      postureLink: `/posture/${ex.postureId || ex._id}`
    }));

    return res.json({
      type: 'category',
      category,
      exercises: response
    });

  } catch (err) {
    console.error('Error in getExercisesByCategory:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
