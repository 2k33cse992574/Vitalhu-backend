// utils/aiHelper.js

/* ===============================
   Exercise Logic
=============================== */
exports.generateExercisePlan = (searchTerm, category, userId) => {
    const exercisesDB = {
        yoga: [
            { title: "Sun Salutation", duration: "10 min", instructions: ["Stand tall", "Raise arms", "Forward fold", "Chaturanga", "Upward dog", "Downward dog", "Repeat"] },
            { title: "Cat-Cow Stretch", duration: "5 min", instructions: ["Start on hands and knees", "Arch your back", "Drop your belly", "Repeat"] }
        ],
        strength: [
            { title: "Bodyweight Squats", duration: "10 min", instructions: ["Stand feet shoulder-width", "Lower down", "Push back up", "Repeat"] },
            { title: "Push-ups", duration: "5 min", instructions: ["Hands shoulder-width", "Lower chest to floor", "Push up", "Repeat"] }
        ],
        cardio: [
            { title: "Jumping Jacks", duration: "5 min", instructions: ["Stand straight", "Jump and spread legs", "Clap overhead", "Repeat"] },
            { title: "High Knees", duration: "5 min", instructions: ["Run in place", "Bring knees high", "Keep core tight", "Repeat"] }
        ]
    };

    const term = searchTerm.toLowerCase();

    // Map search terms to categories if provided
    if (category && exercisesDB[category]) {
        const ex = exercisesDB[category][0]; // return first exercise for that category
        return {
            title: ex.title,
            category,
            routine: ex.instructions
        };
    }

    // Map common exercises
    if (term.includes('push')) {
        const ex = exercisesDB.strength.find(e => e.title.toLowerCase().includes('push')) || exercisesDB.strength[0];
        return { title: ex.title, category: 'strength', routine: ex.instructions };
    }
    if (term.includes('squat')) {
        const ex = exercisesDB.strength.find(e => e.title.toLowerCase().includes('squat')) || exercisesDB.strength[0];
        return { title: ex.title, category: 'strength', routine: ex.instructions };
    }
    if (term.includes('run') || term.includes('jog') || term.includes('cardio')) {
        const ex = exercisesDB.cardio[0];
        return { title: ex.title, category: 'cardio', routine: ex.instructions };
    }
    if (term.includes('yoga')) {
        const ex = exercisesDB.yoga[0];
        return { title: ex.title, category: 'yoga', routine: ex.instructions };
    }

    // Default fallback
    const ex = exercisesDB.yoga[0];
    return { title: ex.title, category: 'yoga', routine: ex.instructions };
};

/* ===============================
   Pain Relief Logic
=============================== */
exports.generatePainReliefRoutine = (painName, language) => {
    const name = (painName && typeof painName === 'string') ? painName.trim().toLowerCase() : "general stretch";
    language = (language || 'en').toLowerCase();

    const routinesMap = {
        "back pain": [
            { title: "Cat-Cow Stretch", instructions: language==='hi'? ["हाथ और घुटनों पर बैठें","पीठ को ऊपर और नीचे झकाएँ"]: ["Hands and knees","Arch your back up and down"] },
            { title: "Child's Pose", instructions: language==='hi'? ["घुटनों के बल बैठें","आगे झुकें","हाथ फैलाएँ"]: ["Kneel down","Stretch forward","Extend arms"] },
            { title: "Pelvic Tilt", instructions: language==='hi'? ["पीठ पर लेटें","पेल्विक को झकाएँ"]: ["Lie on back","Tilt pelvis up and down"] }
        ],
        "neck pain": [
            { title: "Neck Rotation", instructions: language==='hi'? ["धीरे-धीरे सिर घुमाएँ"]: ["Slowly rotate your neck"] },
            { title: "Chin Tuck", instructions: language==='hi'? ["ठोड़ी को पीछे खींचें"]: ["Tuck your chin back"] },
            { title: "Shoulder Shrugs", instructions: language==='hi'? ["कंधे ऊपर-नीचे करें"]: ["Raise and lower shoulders"] }
        ],
        "knee pain": [
            { title: "Quad Stretch", instructions: language==='hi'? ["जांघ खींचें"]: ["Stretch your quads"] },
            { title: "Hamstring Stretch", instructions: language==='hi'? ["हैमस्ट्रिंग खींचें"]: ["Stretch hamstrings"] },
            { title: "Calf Raises", instructions: language==='hi'? ["बछड़े उठाएँ और नीचे करें"]: ["Raise and lower calves"] }
        ]
    };

    return routinesMap[name] || [
        { title: "General Stretch", instructions: language==='hi'? ["स्ट्रेच करें"]: ["Do general stretches"] }
    ];
};

/* ===============================
   Nutrition Logic
=============================== */
exports.generateNutritionPlan = async (userId, language) => {
    language = (language || 'en').toLowerCase();
    const User = require('../models/User');
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const healthConditions = user.healthConditions || [];
        let plan = [];

        if (healthConditions.includes('diabetes')) {
            plan.push(language==='hi'? "नाश्ते में ओट्स खाएं":"Eat oats for breakfast");
            plan.push(language==='hi'? "दोपहर में सलाद खाएं":"Eat salad for lunch");
        } else if (healthConditions.includes('high blood pressure')) {
            plan.push(language==='hi'? "कम नमक वाला भोजन खाएं":"Eat low-salt meals");
        } else {
            plan.push(language==='hi'? "संतुलित आहार लें":"Have a balanced diet");
        }

        plan.push(language==='hi'? "दिन में 2-3 लीटर पानी पिएँ":"Drink 2-3 liters of water daily");

        return { title: "Personalized Diet Plan", plan };
    } catch (err) {
        console.error(err.message);
        return { title: "General Diet Plan", plan: language==='hi'? ["संतुलित आहार लें","दिन में 2-3 लीटर पानी पिएँ"] : ["Have a balanced diet","Drink 2-3 liters of water daily"] };
    }
};

/* ===============================
   Posture Logic
=============================== */
exports.analyzePosture = (postureData, language) => {
    language = (language || 'en').toLowerCase();
    const instructions = [];

    if (!postureData || typeof postureData !== 'object') {
        return { title: "Posture Feedback", instructions: language==='hi'? ["कोई मुद्रा डेटा उपलब्ध नहीं है"]: ["No posture data available"] };
    }

    if (postureData.backAngle > 10) instructions.push(language==='hi'? "पीठ को सीधा रखें":"Keep your back straight");
    if (postureData.neckAngle > 15) instructions.push(language==='hi'? "गर्दन को सीधा रखें":"Keep your neck aligned");
    if (postureData.shouldersLevel > 5) instructions.push(language==='hi'? "कंधों को बराबर रखें":"Level your shoulders evenly");
    if (postureData.hipsAngle > 8) instructions.push(language==='hi'? "कूल्हों को सीधा करें":"Keep your hips balanced");

    if (instructions.length === 0) instructions.push(language==='hi'? "आपकी मुद्रा सही है":"Your posture looks good");

    return { title: "Posture Feedback", instructions };
};
