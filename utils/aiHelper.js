// utils/aiHelper.js

const User = require('../models/User');

/* ===============================
   Exercise Logic (Single Exercise)
=============================== */

const EXERCISES = {
    yoga: [
        { title: "Sun Salutation", duration: "10 min" },
        { title: "Cat-Cow Stretch", duration: "5 min" }
    ],
    strength: [
        { title: "Bodyweight Squats", duration: "10 min" },
        { title: "Push-ups", duration: "5 min" }
    ],
    cardio: [
        { title: "Jumping Jacks", duration: "5 min" },
        { title: "High Knees", duration: "5 min" }
    ]
};

exports.generateExercisePlan = (searchTerm, category, userId) => {
    if (category && EXERCISES[category]) {
        return {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine`,
            category,
            routine: EXERCISES[category]
        };
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        // single exercise routine for normal search
        return {
            title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Routine`,
            category: 'general',
            routine: [{ title: searchTerm }]
        };
    }

    return {
        title: "Beginner Routine",
        category: "yoga",
        routine: EXERCISES.yoga
    };
};

/* ===============================
   Pain Relief Logic (2–3 Exercises)
=============================== */

const PAIN_EXERCISES = {
    "back pain": [
        { title: "Cat-Cow Stretch" },
        { title: "Child's Pose" },
        { title: "Pelvic Tilt" }
    ],
    "neck pain": [
        { title: "Neck Tilt Stretch" },
        { title: "Chin Tuck" },
        { title: "Shoulder Shrugs" }
    ],
    "knee pain": [
        { title: "Quadriceps Stretch" },
        { title: "Hamstring Curl" },
        { title: "Glute Bridge" }
    ],
    "shoulder pain": [
        { title: "Shoulder Rolls" },
        { title: "Arm Circles" },
        { title: "Cross-Body Shoulder Stretch" }
    ]
};

exports.generatePainReliefRoutine = async (painName, language = "en") => {
    const key = painName.toLowerCase();
    const exercises = PAIN_EXERCISES[key] || [
        { title: "General Stretch 1" },
        { title: "General Stretch 2" }
    ];

    return exercises.map(ex => ({
        title: ex.title,
        instructions: language === 'hi'
            ? ["इस व्यायाम को सावधानीपूर्वक करें", "5 बार दोहराएँ"]
            : ["Perform this exercise carefully", "Repeat 5 times"]
    }));
};

/* ===============================
   Nutrition Plan
=============================== */

exports.generateNutritionPlan = async (userId, language = "en") => {
    language = language.toLowerCase();
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
        return {
            title: "General Diet Plan",
            plan: language === 'hi'
                ? ["संतुलित आहार लें", "दिन में 2-3 लीटर पानी पिएँ"]
                : ["Have a balanced diet", "Drink 2-3 liters of water daily"]
        };
    }
};

/* ===============================
   Posture Analysis
=============================== */

exports.analyzePosture = (postureData, language = "en") => {
    language = language.toLowerCase();
    const instructions = [];

    if (!postureData || typeof postureData !== 'object') {
        return {
            title: "Posture Feedback",
            instructions: language === 'hi'
                ? ["कोई मुद्रा डेटा उपलब्ध नहीं है"]
                : ["No posture data available"]
        };
    }

    if (postureData.backAngle > 10) {
        instructions.push(language === 'hi' ? "पीठ को सीधा रखें" : "Keep your back straight");
    }
    if (postureData.neckAngle > 15) {
        instructions.push(language === 'hi' ? "गर्दन को सीधा रखें" : "Keep your neck aligned");
    }
    if (postureData.shouldersLevel > 5) {
        instructions.push(language === 'hi' ? "कंधों को बराबर रखें" : "Level your shoulders evenly");
    }
    if (postureData.hipsAngle > 8) {
        instructions.push(language === 'hi' ? "कूल्हों को सीधा करें" : "Keep your hips balanced");
    }

    if (postureData.selectedExercise) {
        instructions.push(language === 'hi'
            ? `अब ${postureData.selectedExercise} के लिए सही मुद्रा बनाएँ`
            : `Maintain proper posture for ${postureData.selectedExercise}`);
    }

    if (instructions.length === 0) {
        instructions.push(language === 'hi' ? "आपकी मुद्रा सही है" : "Your posture looks good");
    }

    return { title: "Posture Feedback", instructions };
};
