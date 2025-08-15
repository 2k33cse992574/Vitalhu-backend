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
        const term = searchTerm.toLowerCase();
        if (term.includes('back')) {
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
   Pain Relief Logic (2–3 exercises)
=============================== */
exports.generatePainReliefRoutine = (exerciseName, language) => {
    const name = (exerciseName && typeof exerciseName === 'string')
        ? exerciseName.trim()
        : "General Stretch";

    language = (language || 'en').toLowerCase();

    const routines = {
        "back pain": [
            {
                title: "Seated Back Stretch",
                instructions: language === 'hi'
                    ? ["कुर्सी पर सीधे बैठें", "पीठ झुकाएँ", "5 बार दोहराएँ"]
                    : ["Sit straight on a chair", "Bend back gently", "Repeat 5 times"]
            },
            {
                title: "Standing Forward Bend",
                instructions: language === 'hi'
                    ? ["सीधे खड़े हों", "आगे झुकें", "10 सेकंड पकड़ें"]
                    : ["Stand straight", "Bend forward", "Hold 10 seconds"]
            },
            {
                title: "Cat-Cow Stretch",
                instructions: language === 'hi'
                    ? ["हाथ और घुटनों पर आएँ", "पीठ को ऊपर और नीचे झुकाएँ"]
                    : ["Get on hands and knees", "Arch and round your back"]
            }
        ],
        "neck pain": [
            {
                title: "Neck Tilt Right",
                instructions: language === 'hi'
                    ? ["सिर को दाएं झुकाएँ", "5 सेकंड रोकें", "दाईं और बाईं ओर दोहराएँ"]
                    : ["Tilt head to right", "Hold 5 seconds", "Repeat left and right"]
            },
            {
                title: "Neck Tilt Left",
                instructions: language === 'hi'
                    ? ["सिर को बाएं झुकाएँ", "5 सेकंड रोकें", "दोहराएँ"]
                    : ["Tilt head to left", "Hold 5 seconds", "Repeat"]
            },
            {
                title: "Neck Rotation",
                instructions: language === 'hi'
                    ? ["सिर को धीरे-धीरे घुमाएँ", "दाईं और बाईं ओर"]
                    : ["Rotate head slowly", "Right and left"]
            }
        ]
    };

    const key = name.toLowerCase();
    if (routines[key]) return routines[key];

    // fallback general stretch (2 exercises)
    return [
        {
            title: "General Stretch 1",
            instructions: language === 'hi'
                ? ["कुर्सी पर सीधे बैठें", "हाथ ऊपर उठाएँ", "10 सेकंड पकड़ें"]
                : ["Sit straight on a chair", "Raise arms", "Hold 10 seconds"]
        },
        {
            title: "General Stretch 2",
            instructions: language === 'hi'
                ? ["सिर को धीरे-धीरे घुमाएँ", "5 बार दोहराएँ"]
                : ["Rotate head slowly", "Repeat 5 times"]
        }
    ];
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
            instructions: language === 'hi'
                ? ["कोई मुद्रा डेटा उपलब्ध नहीं है"]
                : ["No posture data available"]
        };
    }

    if (postureData.backAngle > 10) instructions.push(language === 'hi' ? "पीठ को सीधा रखें" : "Keep your back straight");
    if (postureData.neckAngle > 15) instructions.push(language === 'hi' ? "गर्दन को सीधा रखें" : "Keep your neck aligned");
    if (postureData.shouldersLevel > 5) instructions.push(language === 'hi' ? "कंधों को बराबर रखें" : "Level your shoulders evenly");
    if (postureData.hipsAngle > 8) instructions.push(language === 'hi' ? "कूल्हों को सीधा करें" : "Keep your hips balanced");

    if (postureData.selectedExercise) {
        instructions.push(language === 'hi'
            ? `अब ${postureData.selectedExercise} के लिए सही मुद्रा बनाएँ`
            : `Maintain proper posture for ${postureData.selectedExercise}`);
    }

    if (instructions.length === 0) instructions.push(language === 'hi' ? "आपकी मुद्रा सही है" : "Your posture looks good");

    return { title: "Posture Feedback", instructions };
};
