const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { signToken } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered." });

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, email: user.email });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken({ id: user._id, email: user.email });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET /api/auth/me (protected - returns current user)
const { verifyToken } = require("../middleware/auth");
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

module.exports = router;
