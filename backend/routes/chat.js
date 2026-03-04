const axios = require("axios");
const express = require("express");
const router = express.Router();

const KNOWLEDGE_RESOURCES = `
N-Skill India (Niile Technical Skill & Consulting Pvt Ltd) provides industrial-grade training.
Courses:
- MEP (Mechanical, Electrical, Plumbing): Wiring, Fire Fighting, BMS.
- HVAC Engineering: Fee ₹15,000.
- NDT & Quality Management: ASNT Level II.
- Fire & Industrial Safety.
- Home Appliance Service: Fee ₹19,999 (Includes Accommodation & Lunch).
Contact: 361/3, Pillaiyar Kovil Street, Kovur, Chennai - 600 122.
Phones: +91 9884209774, +91 8056063023.
Email: nskilltraining@gmail.com
100% Placement Assurance.
`;

router.post("/", async (req, res) => {
    const { message } = req.body;

    try {
        // Using Pollinations.ai for a TRULY FREE, NO-API-KEY-REQUIRED AI
        const prompt = `You are the helpful AI assistant for N-Skill India. 
    Use this knowledge if relevant: ${KNOWLEDGE_RESOURCES}.
    If the question is general, answer it accurately.
    User Question: ${message}`;

        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);

        let botText = response.data;

        res.json({ response: botText });
    } catch (error) {
        console.error("AI Error:", error.message);
        // Silent fallback to local if AI is down
        res.json({
            response: "I'm having a technical glitch, but I'm N-Skill India's support! How can I help you with courses or placements?",
            isMock: true
        });
    }
});

module.exports = router;
