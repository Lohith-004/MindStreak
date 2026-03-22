const express = require("express");
const router = express.Router();
const Study = require("../models/Study");
const auth = require("../middleware/auth");

// ➕ ADD SESSION
router.post("/add", auth, async (req, res) => {
  try {
    const { subject, hours, task } = req.body;

    if (!subject || !hours || !task) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newSession = new Study({
      userId: req.user.id,
      subject,
      hours,
      task,
    });

    await newSession.save();

    res.json({ message: "Study session added" });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📊 GET ALL SESSIONS
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Study.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(sessions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ TOGGLE COMPLETE
router.put("/toggle/:id", auth, async (req, res) => {
  try {
    const session = await Study.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.completed = !session.completed;
    await session.save();

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Toggle Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 STREAK DETAILS
router.get("/streak-details", auth, async (req, res) => {
  try {
    const sessions = await Study.find({
      userId: req.user.id,
      completed: true,
    }).sort({ date: 1 });

    let currentStreak = 0;
    let maxStreak = 0;
    let yearStreak = 0;

    const today = new Date();
    const currentYear = today.getFullYear();

    let prevDate = null;

    sessions.forEach((s) => {
      const d = new Date(s.date);
      const dateStr = d.toDateString();

      if (d.getFullYear() === currentYear) {
        yearStreak++;
      }

      if (!prevDate) {
        currentStreak = 1;
      } else {
        const diff = (d - prevDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = d;
    });

    res.json({
      currentStreak,
      maxStreak,
      yearStreak,
    });
  } catch (err) {
    console.error("Streak Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
