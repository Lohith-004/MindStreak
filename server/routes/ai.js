const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Study = require("../models/Study");
const axios = require("axios");

// 🤖 AI Insights + Planner
router.get("/insights", auth, async (req, res) => {
  try {
    const sessions = await Study.find({ userId: req.user.id });

    if (sessions.length === 0) {
      return res.json({ insights: "No study data available yet." });
    }

    let dataText = sessions
      .map((s) => `Subject: ${s.subject}, Hours: ${s.hours}`)
      .join("\n");

    const prompt = `
Analyze study data and:
1. Give productivity insights
2. Suggest a weekly study plan

${dataText}
        `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiText = response.data.choices[0].message.content;

    res.json({ insights: aiText });
  } catch (error) {
    console.log(error.message);
    res.json({
      insights: "Stay consistent. Try balancing subjects better.",
    });
  }
});

module.exports = router;
