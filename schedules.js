const express = require("express");
const router = express.Router();
const { Schedule } = require("../models/PetSchedule");

// GET /api/schedules — list all schedules for current user
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user.id })
      .populate("petId", "name emoji type")
      .sort({ createdAt: -1 });
    res.json({ schedules });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch schedules." });
  }
});

// GET /api/schedules/today — get today's feeds
router.get("/today", async (req, res) => {
  try {
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const today = dayNames[new Date().getDay()];

    const schedules = await Schedule.find({ userId: req.user.id, days: today })
      .populate("petId", "name emoji type");

    const feeds = schedules.flatMap(s =>
      s.times.map(time => ({
        scheduleId: s._id,
        petId: s.petId._id,
        petName: s.petId.name,
        petEmoji: s.petId.emoji,
        time,
        label: s.label,
        fed: s.fedTimes?.get(`${new Date().toDateString()}-${time}`) || false
      }))
    ).sort((a, b) => a.time.localeCompare(b.time));

    res.json({ feeds });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's feeds." });
  }
});

// POST /api/schedules — create a schedule
router.post("/", async (req, res) => {
  try {
    const { petId, label, times, days, notes } = req.body;

    if (!petId) return res.status(400).json({ error: "petId is required." });
    if (!times?.length) return res.status(400).json({ error: "At least one time is required." });
    if (!days?.length) return res.status(400).json({ error: "At least one day is required." });

    const schedule = await Schedule.create({
      userId: req.user.id, petId, label, times, days, notes
    });
    res.status(201).json({ schedule });
  } catch (err) {
    res.status(500).json({ error: "Failed to create schedule." });
  }
});

// PUT /api/schedules/:id — update a schedule
router.put("/:id", async (req, res) => {
  try {
    const { petId, label, times, days, notes } = req.body;
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { petId, label, times, days, notes },
      { new: true, runValidators: true }
    );
    if (!schedule) return res.status(404).json({ error: "Schedule not found." });
    res.json({ schedule });
  } catch (err) {
    res.status(500).json({ error: "Failed to update schedule." });
  }
});

// PATCH /api/schedules/:id/fed — mark a specific feeding as done
router.patch("/:id/fed", async (req, res) => {
  try {
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: "time is required." });

    const dateKey = `${new Date().toDateString()}-${time}`;
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { [`fedTimes.${dateKey}`]: true } },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ error: "Schedule not found." });
    res.json({ schedule, message: `Marked fed at ${time}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark feeding." });
  }
});

// DELETE /api/schedules/:id — delete a schedule
router.delete("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!schedule) return res.status(404).json({ error: "Schedule not found." });
    res.json({ message: "Schedule deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete schedule." });
  }
});

module.exports = router;
