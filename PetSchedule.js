const mongoose = require("mongoose");

// ─── Pet Model ────────────────────────────────────────────────────────────────
const petSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 40 },
  type: {
    type: String,
    enum: ["dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle", "other"],
    default: "other"
  },
  emoji: { type: String, default: "🐾" },
  age: { type: Number, min: 0, max: 100 },
  notes: { type: String, maxlength: 300 }
}, { timestamps: true });

// ─── Schedule Model ───────────────────────────────────────────────────────────
const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  label: { type: String, default: "Meal", maxlength: 40 },
  times: [{ type: String, match: /^\d{2}:\d{2}$/ }], // e.g. "08:00"
  days: [{
    type: String,
    enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  }],
  notes: { type: String, maxlength: 200 },
  // Tracks per-day feeding completions: { "Mon Jun 3 2024-08:00": true }
  fedTimes: { type: Map, of: Boolean, default: {} }
}, { timestamps: true });

const Pet = mongoose.model("Pet", petSchema);
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = { Pet, Schedule };
