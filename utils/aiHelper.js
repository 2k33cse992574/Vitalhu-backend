const User = require('../models/User');

/* ===============================
   Enhanced Exercise Database
=============================== */








const EXERCISES = {
  yoga: [
    { 
      id: "sun-salutation",
      title: "Sun Salutation", 
      duration: "10 min",
      description: "A sequence of 12 powerful yoga poses for full-body stretch",
      benefits: ["Improves flexibility", "Enhances circulation", "Reduces stress"],
      painRelief: ["back pain", "neck pain"],
      keywords: ["sun salutation", "surya namaskar", "yoga sequence"]
    },
    { 
      id: "cat-cow",
      title: "Cat-Cow Stretch", 
      duration: "5 min",
      description: "Gentle flow between two poses that stretches back and neck",
      benefits: ["Spinal flexibility", "Core engagement", "Stress relief"],
      painRelief: ["back pain", "neck pain"],
      keywords: ["cat cow", "cat pose", "cow pose", "spine stretch"]
    },
    {
      id: "childs-pose",
      title: "Child's Pose",
      duration: "3 min",
      description: "Resting pose that stretches hips, thighs and ankles",
      benefits: ["Relaxes spine", "Relieves back tension", "Calms mind"],
      painRelief: ["back pain", "shoulder pain"],
      keywords: ["child pose", "balasana", "resting yoga pose"]
    },
    {
      id: "downward-dog",
      title: "Downward Dog",
      duration: "5 min",
      description: "Inverted V-pose stretches hamstrings and shoulders",
      benefits: ["Improves circulation", "Stretches hamstrings", "Relieves back tension"],
      painRelief: ["back pain", "shoulder pain"],
      keywords: ["downward dog", "adho mukha svanasana", "inverted v pose"]
    },
    {
      id: "cobra-pose",
      title: "Cobra Pose",
      duration: "3 min",
      description: "Backbend pose to strengthen spine",
      benefits: ["Strengthens back", "Opens chest", "Improves posture"],
      painRelief: ["back pain"],
      keywords: ["cobra pose", "bhujangasana", "spine strength"]
    },
    {
      id: "warrior-i",
      title: "Warrior I",
      duration: "5 min",
      description: "Standing pose to strengthen legs and shoulders",
      benefits: ["Builds lower body strength", "Opens hips", "Improves focus"],
      painRelief: ["hip pain"],
      keywords: ["warrior 1", "virabhadrasana i", "standing yoga pose"]
    },
    {
      id: "warrior-ii",
      title: "Warrior II",
      duration: "5 min",
      description: "Strengthens legs and improves balance",
      benefits: ["Leg strength", "Stability", "Opens hips"],
      painRelief: ["hip pain"],
      keywords: ["warrior 2", "virabhadrasana ii", "standing yoga pose"]
    },
    {
      id: "tree-pose",
      title: "Tree Pose",
      duration: "3 min",
      description: "Balance pose improving focus and leg strength",
      benefits: ["Balance", "Focus", "Leg strength"],
      painRelief: ["knee pain"],
      keywords: ["tree pose", "vrksasana", "balance pose"]
    }
  ],
  strength: [
    { 
      id: "bodyweight-squats",
      title: "Bodyweight Squats", 
      duration: "10 min",
      description: "Fundamental lower body exercise targeting quads and glutes",
      benefits: ["Builds leg strength", "Improves mobility", "Burns calories"],
      painRelief: ["knee pain"],
      keywords: ["squat", "bodyweight squat", "leg exercise"]
    },
    { 
      id: "push-ups",
      title: "Push-ups", 
      duration: "5 min",
      description: "Classic upper body exercise working chest, shoulders and arms",
      benefits: ["Upper body strength", "Core stability", "No equipment needed"],
      painRelief: [],
      keywords: ["push up", "push-up", "pushups", "upper body strength"]
    },
    {
      id: "glute-bridge",
      title: "Glute Bridge",
      duration: "7 min",
      description: "Isolates and strengthens glutes and hamstrings",
      benefits: ["Improves posture", "Strengthens lower back", "Hip mobility"],
      painRelief: ["back pain", "knee pain"],
      keywords: ["glute bridge", "hip raise", "butt exercise"]
    },
    {
      id: "plank",
      title: "Plank",
      duration: "3 min",
      description: "Core strengthening exercise",
      benefits: ["Core stability", "Improves posture", "Strengthens arms"],
      painRelief: ["back pain"],
      keywords: ["plank hold", "core plank", "abs exercise"]
    },
    {
      id: "lunges",
      title: "Lunges",
      duration: "5 min",
      description: "Strengthens legs and improves balance",
      benefits: ["Leg strength", "Hip mobility", "Balance"],
      painRelief: ["knee pain"],
      keywords: ["lunge", "forward lunge", "leg strength"]
    },
    {
      id: "tricep-dips",
      title: "Tricep Dips",
      duration: "5 min",
      description: "Upper body exercise for arms",
      benefits: ["Arm strength", "Shoulder stability", "Upper body tone"],
      painRelief: ["shoulder pain"],
      keywords: ["triceps dip", "bench dips", "arm exercise"]
    }
  ],
  cardio: [
    { 
      id: "jumping-jacks",
      title: "Jumping Jacks", 
      duration: "5 min",
      description: "Full-body cardiovascular exercise",
      benefits: ["Improves coordination", "Boosts heart rate", "Full-body warmup"],
      painRelief: [],
      keywords: ["jumping jack", "full body warmup", "cardio"]
    },
    { 
      id: "high-knees",
      title: "High Knees", 
      duration: "5 min",
      description: "Running in place while bringing knees up high",
      benefits: ["Cardiovascular endurance", "Core engagement", "Leg strength"],
      painRelief: [],
      keywords: ["high knees", "running", "jogging in place"]
    },
    {
      id: "modified-jumping-jacks",
      title: "Modified Jumping Jacks",
      duration: "5 min",
      description: "Low-impact version of jumping jacks",
      benefits: ["Gentle cardio", "Joint-friendly", "Improves mobility"],
      painRelief: ["knee pain"],
      keywords: ["low impact jumping jack", "gentle cardio", "easy jumping jack"]
    },
    {
      id: "burpees",
      title: "Burpees",
      duration: "7 min",
      description: "Full-body explosive movement",
      benefits: ["Cardio", "Strength", "Endurance"],
      painRelief: [],
      keywords: ["burpee", "full body cardio", "strength cardio"]
    },
    {
      id: "mountain-climbers",
      title: "Mountain Climbers",
      duration: "5 min",
      description: "Cardio and core strengthening",
      benefits: ["Core strength", "Agility", "Cardio"],
      painRelief: ["knee pain"],
      keywords: ["mountain climber", "core cardio", "fast plank"]
    },
    {
      id: "skater-jumps",
      title: "Skater Jumps",
      duration: "5 min",
      description: "Lateral movement for agility",
      benefits: ["Leg strength", "Coordination", "Balance"],
      painRelief: ["knee pain"],
      keywords: ["skater jump", "side jumps", "agility exercise"]
    }
  ]
};


// Flattened exercise list with category preservation
const ALL_EXERCISES = Object.entries(EXERCISES).flatMap(([category, exercises]) => 
  exercises.map(ex => ({ ...ex, category }))
);

/* ===============================
   Enhanced Pain Relief Database
=============================== */

const PAIN_EXERCISES = {
  "back pain": [
    { 
      id: "cat-cow",
      title: "Cat-Cow Stretch",
      description: "Gentle spinal movement to relieve tension",
      duration: "5 min"
    },
    { 
      id: "childs-pose",
      title: "Child's Pose",
      description: "Restorative stretch for lower back relief",
      duration: "3 min"
    },
    { 
      id: "pelvic-tilt",
      title: "Pelvic Tilt",
      description: "Strengthens core to support the back",
      duration: "5 min"
    }
  ],
  "neck pain": [
    { 
      id: "neck-tilt",
      title: "Neck Tilt Stretch",
      description: "Gentle side-to-side neck stretch",
      duration: "3 min"
    },
    { 
      id: "chin-tuck",
      title: "Chin Tuck",
      description: "Improves neck alignment and posture",
      duration: "3 min"
    },
    { 
      id: "shoulder-shrugs",
      title: "Shoulder Shrugs",
      description: "Releases tension in neck and shoulders",
      duration: "3 min"
    }
  ],
  "knee pain": [
    { 
      id: "quad-stretch",
      title: "Quadriceps Stretch",
      description: "Stretches front thigh muscles",
      duration: "3 min per leg"
    },
    { 
      id: "hamstring-curl",
      title: "Hamstring Curl",
      description: "Strengthens supporting muscles",
      duration: "5 min"
    },
    { 
      id: "glute-bridge",
      title: "Glute Bridge",
      description: "Builds strength without knee strain",
      duration: "7 min"
    }
  ],
  "shoulder pain": [
    { 
      id: "shoulder-rolls",
      title: "Shoulder Rolls",
      description: "Gentle mobility exercise",
      duration: "3 min"
    },
    { 
      id: "arm-circles",
      title: "Arm Circles",
      description: "Improves shoulder mobility",
      duration: "3 min"
    },
    { 
      id: "cross-body-stretch",
      title: "Cross-Body Shoulder Stretch",
      description: "Relieves shoulder tension",
      duration: "2 min per arm"
    }
  ]
};

/* ===============================
   Normalize search terms (variants)
=============================== */
const normalizeSearchTerm = (term) => {
  const variations = {
    'pushup': 'push-ups',
    'push ups': 'push-ups',
    'pushups': 'push-ups',
    'squats': 'bodyweight-squats',
    'jumpingjack': 'jumping-jacks',
    'jumping jacks': 'jumping-jacks',
    'run': 'high-knees',
    'running': 'high-knees',
    'jog': 'high-knees',
    'jogging': 'high-knees'
  };
  
  let normalized = term.toLowerCase().trim();
  Object.entries(variations).forEach(([variant, standard]) => {
    normalized = normalized.replace(new RegExp(`\\b${variant}\\b`, 'g'), standard);
  });
  return normalized;
};

/* ===============================
   Generate Exercise Plan
=============================== */
/* ===============================
   Generate Exercise Plan
=============================== */
const generateExercisePlan = (searchTerm, category, userId) => {
  if (category && EXERCISES[category]) {
    return {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine`,
      category,
      routine: EXERCISES[category]
    };
  }

  if (searchTerm) {
    const painKey = Object.keys(PAIN_EXERCISES).find(pain =>
      searchTerm.toLowerCase().includes(pain)
    );
    if (painKey) {
      const routine = PAIN_EXERCISES[painKey].slice(0, 3);
      return {
        title: `${painKey.charAt(0).toUpperCase() + painKey.slice(1)} Relief Routine`,
        category: 'pain-relief',
        routine
      };
    }

    const term = normalizeSearchTerm(searchTerm);

    // 1. Exact title match
    const exactMatch = ALL_EXERCISES.find(ex => ex.title.toLowerCase() === term);
    if (exactMatch) return {
      title: `Search Result for "${searchTerm}"`,
      category: exactMatch.category,
      routine: [exactMatch]
    };

    // 2. Match in title OR keywords
    const keywordMatches = ALL_EXERCISES.filter(ex =>
      ex.title.toLowerCase().includes(term) ||
      (ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(term)))
    );
    if (keywordMatches.length > 0) return {
      title: `Search Results for "${searchTerm}"`,
      category: keywordMatches[0].category,
      routine: keywordMatches
    };

    // 3. Fallback ID match
    const fallback = ALL_EXERCISES.find(ex => ex.id === term);
    if (fallback) return {
      title: `Search Result for "${searchTerm}"`,
      category: fallback.category,
      routine: [fallback]
    };
  }

  return {
    title: "Beginner Routine",
    category: "yoga",
    routine: EXERCISES.yoga.slice(0, 2)
  };
};

/* ===============================
   Generate Pain Relief Routine
=============================== */
const generatePainReliefRoutine = async (painName, language = "en") => {
  const key = painName.toLowerCase();
  const exercises = PAIN_EXERCISES[key] || [
    { 
      id: "general-stretch-1",
      title: "General Stretch 1",
      description: "Basic full-body stretch",
      duration: "5 min"
    },
    { 
      id: "general-stretch-2",
      title: "General Stretch 2",
      description: "Gentle mobility routine",
      duration: "5 min"
    }
  ];

  return exercises.map(ex => ({
    ...ex,
    instructions: language === 'hi'
      ? ["इस व्यायाम को सावधानीपूर्वक करें", "5 बार दोहराएँ"]
      : ["Perform this exercise carefully", "Repeat 5 times"]
  }));
};

/* ===============================
   Get Exercise by ID
=============================== */
const getExerciseById = (exerciseId) => {
  return ALL_EXERCISES.find(ex => ex.id === exerciseId) || null;
};

/* ===============================
   Export all constants and functions
=============================== */
module.exports = {
  EXERCISES,
  ALL_EXERCISES,
  PAIN_EXERCISES,
  normalizeSearchTerm,
  generateExercisePlan,
  generatePainReliefRoutine,
  getExerciseById
};
