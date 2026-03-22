const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const studyRoutes = require("./routes/study");
const aiRoutes = require("./routes/ai");

app.use("/api/auth", authRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// PORT FIX ✅
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
