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
            painRelief: ["back pain", "neck pain"]
        },
        { 
            id: "cat-cow",
            title: "Cat-Cow Stretch", 
            duration: "5 min",
            description: "Gentle flow between two poses that stretches back and neck",
            benefits: ["Spinal flexibility", "Core engagement", "Stress relief"],
            painRelief: ["back pain", "neck pain"]
        },
        {
            id: "childs-pose",
            title: "Child's Pose",
            duration: "3 min",
            description: "Resting pose that stretches hips, thighs and ankles",
            benefits: ["Relaxes spine", "Relieves back tension", "Calms mind"],
            painRelief: ["back pain", "shoulder pain"]
        }
    ],
    strength: [
        { 
            id: "bodyweight-squats",
            title: "Bodyweight Squats", 
            duration: "10 min",
            description: "Fundamental lower body exercise targeting quads and glutes",
            benefits: ["Builds leg strength", "Improves mobility", "Burns calories"],
            painRelief: ["knee pain"]
        },
        { 
            id: "push-ups",
            title: "Push-ups", 
            duration: "5 min",
            description: "Classic upper body exercise working chest, shoulders and arms",
            benefits: ["Upper body strength", "Core stability", "No equipment needed"],
            painRelief: []
        },
        {
            id: "glute-bridge",
            title: "Glute Bridge",
            duration: "7 min",
            description: "Isolates and strengthens glutes and hamstrings",
            benefits: ["Improves posture", "Strengthens lower back", "Hip mobility"],
            painRelief: ["back pain", "knee pain"]
        }
    ],
    cardio: [
        { 
            id: "jumping-jacks",
            title: "Jumping Jacks", 
            duration: "5 min",
            description: "Full-body cardiovascular exercise",
            benefits: ["Improves coordination", "Boosts heart rate", "Full-body warmup"],
            painRelief: []
        },
        { 
            id: "high-knees",
            title: "High Knees", 
            duration: "5 min",
            description: "Running in place while bringing knees up high",
            benefits: ["Cardiovascular endurance", "Core engagement", "Leg strength"],
            painRelief: []
        },
        {
            id: "modified-jumping-jacks",
            title: "Modified Jumping Jacks",
            duration: "5 min",
            description: "Low-impact version of jumping jacks",
            benefits: ["Gentle cardio", "Joint-friendly", "Improves mobility"],
            painRelief: ["knee pain"]
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
   Search Term Normalization
=============================== */

const normalizeSearchTerm = (term) => {
    const variations = {
        'pushup': 'push-up',
        'push ups': 'push-up',
        'pushups': 'push-up',
        'squats': 'squat',
        'jumpingjack': 'jumping-jack'
    };
    
    let normalized = term.toLowerCase().trim();
    
    Object.entries(variations).forEach(([variant, standard]) => {
        normalized = normalized.replace(new RegExp(variant, 'g'), standard);
    });
    
    return normalized;
};

/* ===============================
   Enhanced Exercise Search Logic
=============================== */

exports.generateExercisePlan = (searchTerm, category, userId) => {
    // 1. Handle category-based requests
    if (category && EXERCISES[category]) {
        return {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine`,
            category: category,
            routine: EXERCISES[category]
        };
    }

    // 2. Handle pain-specific searches
    const painKey = Object.keys(PAIN_EXERCISES).find(pain => 
        searchTerm.toLowerCase().includes(pain)
    );
    
    if (painKey) {
        return {
            title: `${painKey.charAt(0).toUpperCase() + painKey.slice(1)} Relief Routine`,
            category: 'pain-relief',
            routine: PAIN_EXERCISES[painKey]
        };
    }

    // 3. Handle general exercise searches (FIXED VERSION)
    if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        // Priority 1: Exact title match
        const exactMatches = ALL_EXERCISES.filter(ex => 
            ex.title.toLowerCase() === term
        );
        
        // Priority 2: Exact match in description
        const descExactMatches = ALL_EXERCISES.filter(ex => 
            ex.description && ex.description.toLowerCase().includes(term)
        );
        
        // Priority 3: Partial title matches (whole words only)
        const partialTitleMatches = ALL_EXERCISES.filter(ex => 
            ex.title.toLowerCase().split(/\s+/).some(word => word === term)
        );
        
        // Priority 4: Partial description matches (whole words only)
        const partialDescMatches = ALL_EXERCISES.filter(ex => 
            ex.description && ex.description.toLowerCase().split(/\s+/).some(word => word === term)
        );
        
        // Combine with priority order and remove duplicates
        const uniqueMatches = [
            ...exactMatches,
            ...descExactMatches,
            ...partialTitleMatches,
            ...partialDescMatches
        ].filter((ex, index, self) => 
            index === self.findIndex(e => e.id === ex.id)
        );
        
        if (uniqueMatches.length > 0) {
            return {
                title: `Search Results for "${searchTerm}"`,
                category: uniqueMatches[0].category || 'general',
                routine: uniqueMatches
            };
        }
    }

    // 4. Default fallback
    return {
        title: "Beginner Routine",
        category: "yoga",
        routine: EXERCISES.yoga.slice(0, 2)
    };
};

/* ===============================
   Enhanced Pain Relief Logic
=============================== */

exports.generatePainReliefRoutine = async (painName, language = "en") => {
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
   Nutrition Plan
=============================== */

exports.generateNutritionPlan = async (userId, language = "en") => {
    // ... (existing implementation)
};

/* ===============================
   Posture Analysis
=============================== */

exports.analyzePosture = (postureData, language = "en") => {
    // ... (existing implementation)
};

/* ===============================
   Get Exercise by ID
=============================== */

exports.getExerciseById = (exerciseId) => {
    return ALL_EXERCISES.find(ex => ex.id === exerciseId) || null;
};