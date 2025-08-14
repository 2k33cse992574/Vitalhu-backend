// utils/aiHelper.js

const User = require('../models/User');

/* ===============================
   Exercise Logic
=============================== */
exports.generateExercisePlan = (searchTerm, category, userId) => {
    const exercises = {
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

    if (category && exercises[category]) {
        return {
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Routine`,
            category,
            routine: exercises[category]
        };
    }

    if (searchTerm) {
        if (searchTerm.toLowerCase().includes('back')) {
            return {
                title: "Back Pain Relief Routine",
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
   Pain Relief Logic
=============================== */
exports.generatePainReliefRoutine = (exerciseName, language) => {
    // Validate exerciseName
    if (!exerciseName || typeof exerciseName !== 'string' || exerciseName.trim() === '') {
        exerciseName = "General Stretch"; // default name
    }

    language = language || 'en'; // default language

    const routines = {
        "back stretch": {
            en: [
                "Sit straight on a chair",
                "Stretch your arms forward",
                "Hold for 10 seconds",
                "Relax and repeat 5 times"
            ],
            hi: [
                "कुर्सी पर सीधे बैठें",
                "अपने हाथ आगे बढ़ाएँ",
                "10 सेकंड के लिए पकड़ें",
                "आराम करें और 5 बार दोहराएँ"
            ]
        },
        "neck stretch": {
            en: [
                "Sit straight",
                "Tilt your head to the right",
                "Hold 5 seconds",
                "Tilt to left and repeat"
            ],
            hi: [
                "सीधे बैठें",
                "सिर को दाएं झुकाएँ",
                "5 सेकंड के लिए पकड़ें",
                "बाएं झुकाएँ और दोहराएँ"
            ]
        }
    };

    const key = exerciseName.toLowerCase();
    const routineData = routines[key];

    if (routineData) {
        return {
            title: `${exerciseName} Routine`,
            instructions: routineData[language] || routineData['en']
        };
    }

    // Default routine if exercise not found
    return {
        title: "General Stretch Routine",
        instructions: language === 'hi' ?
            ["कुर्सी पर सीधे बैठें", "हाथ ऊपर उठाएँ", "10 सेकंड के लिए पकड़ें"] :
            ["Sit straight on a chair", "Raise your arms", "Hold for 10 seconds"]
    };
};

/* ===============================
   Nutrition Logic
=============================== */
exports.generateNutritionPlan = async (userId, language) => {
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

        return {
            title: "Personalized Diet Plan",
            plan
        };
    } catch (err) {
        console.error(err.message);
        return {
            title: "General Diet Plan",
            plan: language === 'hi' ?
                ["संतुलित आहार लें", "दिन में 2-3 लीटर पानी पिएँ"] :
                ["Have a balanced diet", "Drink 2-3 liters of water daily"]
        };
    }
};

/* ===============================
   Posture Logic
=============================== */
exports.analyzePosture = (postureData, language) => {
    let instructions = [];

    if (postureData.backAngle && postureData.backAngle > 10) {
        instructions.push(language === 'hi' ? "पीठ सीधी करें" : "Straighten your back");
    }

    if (postureData.neckAngle && postureData.neckAngle > 15) {
        instructions.push(language === 'hi' ? "गर्दन को सीधा रखें" : "Keep your neck straight");
    }

    if (postureData.shouldersLevel && postureData.shouldersLevel > 5) {
        instructions.push(language === 'hi' ? "कंधे बराबर रखें" : "Level your shoulders");
    }

    if (instructions.length === 0) {
        instructions.push(language === 'hi' ? "अच्छी मुद्रा" : "Good posture");
    }

    return {
        title: "Posture Feedback",
        instructions
    };
};
