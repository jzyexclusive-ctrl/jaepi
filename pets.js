const express = require("express");
const router = express.Router();
const { Pet } = require("../models/PetSchedule");

// GET /api/pets — list all pets for current user
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pets." });
  }
});

// POST /api/pets — create a pet
router.post("/", async (req, res) => {
  try {
    const { name, type, emoji, age, notes } = req.body;
    if (!name) return res.status(400).json({ error: "Pet name is required." });

    const pet = await Pet.create({ userId: req.user.id, name, type, emoji, age, notes });
    res.status(201).json({ pet });
  } catch (err) {
    res.status(500).json({ error: "Failed to create pet." });
  }
});

// PUT /api/pets/:id — update a pet
router.put("/:id", async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ error: "Pet not found." });
    res.json({ pet });
  } catch (err) {
    res.status(500).json({ error: "Failed to update pet." });
  }
});

// DELETE /api/pets/:id — delete a pet
router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!pet) return res.status(404).json({ error: "Pet not found." });

    // Also delete associated schedules
    const { Schedule } = require("../models/PetSchedule");
    await Schedule.deleteMany({ petId: req.params.id, userId: req.user.id });

    res.json({ message: "Pet deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete pet." });
  }
});

module.exports = router;
