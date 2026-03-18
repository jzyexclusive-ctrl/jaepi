/**
 * PawTime Backend - Express + MongoDB
 * Run: npm install && npm run dev
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/pets");
const scheduleRoutes = require("./routes/schedules");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", verifyToken, petRoutes);
app.use("/api/schedules", verifyToken, scheduleRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/pawtime")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
