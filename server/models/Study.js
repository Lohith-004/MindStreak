const mongoose = require("mongoose");

const studySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subject: String,
  hours: Number,
  task: String, // ✅ NEW
  completed: {
    type: Boolean,
    default: false, // ✅ NEW
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Study", studySchema);
