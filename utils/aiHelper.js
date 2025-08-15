const User = require('../models/User');

/* ===============================
   Exercise Logic
=============================== */
exports.generateExercisePlan = (searchTerm, category, userId) => {
    const exercises = {
        yoga: [
            { title: "Sun Salutation", duration: "10 min", instructions: ["Do slowly", "Focus on breathing"] },
            { title: "Cat-Cow Stretch", duration: "5 min", instructions: ["Alternate spine movements", "5 reps"] },
            { title: "Child's Pose", duration: "5 min", instructions: ["Knees on floor", "Stretch arms forward"] }
        ],
        strength: [
            { title: "Bodyweight Squats", duration: "10 min", instructions: ["Keep back straight", "15 reps"] },
            { title: "Push-ups", duration: "5 min", instructions: ["Hands shoulder-width", "10 reps"] },
            { title: "Lunges", duration: "5 min", instructions: ["Step forward", "10 reps each leg"] }
        ],
        cardio: [
            { title: "Jumping Jacks", duration: "5 min", instructions: ["Do continuously", "Focus on breathing"] },
            { title: "High Knees", duration: "5 min", instructions: ["Lift knees to chest", "30 secs"] },
            { title: "Jog in Place", duration: "5 min", instructions: ["Keep posture straight", "2 mins"] }
        ]
    };

    if (category && exercises[category]) {
        return {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine`,
            category,
            routine: exercises[category]
        };
    }

    // Map searchTerm to category if possible
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (term.includes('back') || term.includes('neck') || term.includes('knee')) {
            return {
                title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Exercise Routine`,
                category: "yoga",
                routine: exercises.yoga
            };
        }
    }

    return {
        title: "Beginner Routine",
        category: "yoga",
        routine: exercises.yoga
    };
};

/* ===============================
   Pain Relief Logic (Fixed)
=============================== */
const PAIN_EXERCISE_MAP = {
    "back pain": [
        { title: "Cat-Cow Stretch", instructions: ["Arch your back slowly", "Repeat 5 times"] },
        { title: "Child's Pose", instructions: ["Knees on floor", "Stretch arms forward"] },
        { title: "Pelvic Tilt", instructions: ["Lie on back", "Tilt pelvis up and down"] }
    ],
    "neck pain": [
        { title: "Neck Rotation", instructions: ["Rotate head slowly", "5 reps each side"] },
        { title: "Chin Tuck", instructions: ["Tuck chin to chest", "Hold 5 secs"] },
        { title: "Shoulder Shrugs", instructions: ["Lift shoulders up", "Repeat 10 times"] }
    ],
    "knee pain": [
        { title: "Quadriceps Stretch", instructions: ["Pull ankle towards glutes", "Hold 20 secs"] },
        { title: "Hamstring Stretch", instructions: ["Sit and reach toes", "Hold 20 secs"] },
        { title: "Heel Slides", instructions: ["Slide heel up and down", "10 reps each leg"] }
    ],
    "shoulder pain": [
        { title: "Shoulder Rolls", instructions: ["Roll shoulders forward and back", "10 reps"] },
        { title: "Arm Across Chest", instructions: ["Pull arm across chest", "Hold 15 secs"] },
        { title: "Wall Angels", instructions: ["Slide arms on wall", "10 reps"] }
    ]
};

exports.generatePainReliefRoutine = (painName, language) => {
    const key = painName.toLowerCase();
    const exercises = PAIN_EXERCISE_MAP[key];

    if (exercises && exercises.length > 0) {
        // Return first 2–3 unique exercises
        const selected = exercises.slice(0, 3);
        return selected.map(ex => ({
            title: ex.title,
            instructions: ex.instructions
        }));
    }

    // Default general stretch
    return [
        { title: "General Stretch", instructions: language === 'hi'
            ? ["कुर्सी पर सीधे बैठें", "हाथ ऊपर उठाएँ", "10 सेकंड के लिए पकड़ें"]
            : ["Sit straight on a chair", "Raise your arms", "Hold for 10 seconds"]
        }
    ];
};

/* ===============================
   Nutrition Logic
=============================== */
exports.generateNutritionPlan = async (userId, language) => {
    language = (language || 'en').toLowerCase();
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const healthConditions = user.healthConditions || [];
        let plan = [];

        if (healthConditions.includes('diabetes')) {
            plan.push(language === 'hi' ? "नाश्ते में ओट्स खाएं" : "Eat oats for breakfast");
            plan.push(language === 'hi' ? "दोपहर में सलाद खाएं" : "Eat salad for lunch");
        } else if (healthConditions.includes('high blood pressure')) {
            plan.push(language === 'hi' ? "कम नमक वाला भोजन खाएं" : "Eat low-salt meals");
        } else {
            plan.push(language === 'hi' ? "संतुलित आहार लें" : "Have a balanced diet");
        }

        plan.push(language === 'hi' ? "दिन में 2-3 लीटर पानी पिएँ" : "Drink 2-3 liters of water daily");

        return { title: "Personalized Diet Plan", plan };
    } catch (err) {
        console.error(err.message);
        return { title: "General Diet Plan", plan: language === 'hi'
            ? ["संतुलित आहार लें", "दिन में 2-3 लीटर पानी पिएँ"]
            : ["Have a balanced diet", "Drink 2-3 liters of water daily"]
        };
    }
};

/* ===============================
   Posture Logic
=============================== */
exports.analyzePosture = (postureData, language) => {
    language = (language || 'en').toLowerCase();
    const instructions = [];

    if (!postureData || typeof postureData !== 'object') {
        return {
            title: "Posture Feedback",
            instructions: language === 'hi' ? ["कोई मुद्रा डेटा उपलब्ध नहीं है"] : ["No posture data available"]
        };
    }

    if (postureData.backAngle > 10) instructions.push(language === 'hi' ? "पीठ को सीधा रखें" : "Keep your back straight");
    if (postureData.neckAngle > 15) instructions.push(language === 'hi' ? "गर्दन को सीधा रखें" : "Keep your neck aligned");
    if (postureData.shouldersLevel > 5) instructions.push(language === 'hi' ? "कंधों को बराबर रखें" : "Level your shoulders evenly");
    if (postureData.hipsAngle > 8) instructions.push(language === 'hi' ? "कूल्हों को सीधा करें" : "Keep your hips balanced");

    if (instructions.length === 0) instructions.push(language === 'hi' ? "आपकी मुद्रा सही है" : "Your posture looks good");

    return { title: "Posture Feedback", instructions };
};
