const express = require("express");
const Study = require("../models/Study");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ➕ Add Study Session + Update Streak
router.post("/add", auth, async (req, res) => {
  try {
    const { subject, hours, task } = req.body;

    const study = new Study({
      userId: req.user.id,
      subject,
      hours,
      task,
    });

    await study.save();

    // 🔥 STREAK LOGIC
    const user = await User.findById(req.user.id);

    const today = new Date();
    const lastDate = user.lastStudyDate;

    if (!lastDate) {
      user.streak = 1;
    } else {
      const diff = Math.floor(
        (today - new Date(lastDate)) / (1000 * 60 * 60 * 24),
      );

      if (diff === 1) {
        user.streak += 1;
      } else if (diff > 1) {
        user.streak = 1;
      }
    }

    user.lastStudyDate = today;
    await user.save();

    res.json({
      message: "Study session added",
      streak: user.streak,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding session" });
  }
});

// 📥 Get Sessions
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Study.find({ userId: req.user.id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

// 🔄 Toggle Complete
router.put("/toggle/:id", auth, async (req, res) => {
  try {
    const session = await Study.findById(req.params.id);

    session.completed = !session.completed;

    await session.save();

    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating" });
  }
});

// 🔥 Get Streak
router.get("/streak", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ streak: user.streak || 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching streak" });
  }
});

module.exports = router;

// 📊 FINAL FIXED STREAK LOGIC
router.get("/streak-details", auth, async (req, res) => {
  try {
    const sessions = await Study.find({ userId: req.user.id });

    // ✅ Only completed sessions
    const completed = sessions.filter(s => s.completed);

    if (completed.length === 0) {
      return res.json({
        currentStreak: 0,
        maxStreak: 0,
        yearStreak: 0
      });
    }

    // 🗓 Get unique sorted dates
    const dates = [
      ...new Set(
        completed.map(s =>
          new Date(s.date).toDateString()
        )
      )
    ].sort((a, b) => new Date(a) - new Date(b));

    // 🔥 MAX STREAK
    let maxStreak = 1;
    let temp = 1;

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);

      const diff = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        temp++;
      } else {
        temp = 1;
      }

      maxStreak = Math.max(maxStreak, temp);
    }

    // 🔥 CURRENT STREAK (from today backwards)
    let currentStreak = 0;
    let today = new Date();

    while (true) {
      const dayStr = today.toDateString();

      if (dates.includes(dayStr)) {
        currentStreak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }

    // 📅 YEAR STREAK
    const currentYear = new Date().getFullYear();

    const yearStreak = completed.filter(
      s => new Date(s.date).getFullYear() === currentYear
    ).length;

    res.json({
      currentStreak,
      maxStreak,
      yearStreak
    });

  } catch (err) {
    res.status(500).json({ message: "Error streak details" });
  }
});