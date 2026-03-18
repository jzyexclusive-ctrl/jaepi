/**
 * PawTime Seed Script
 * Populates MongoDB with sample data for testing.
 * Run: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pawtime";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await mongoose.connection.db.dropDatabase();
  console.log("Cleared database");

  // Create test user
  const hashedPw = await bcrypt.hash("password123", 12);
  const user = await mongoose.connection.db.collection("users").insertOne({
    name: "Alex Johnson",
    email: "alex@example.com",
    password: hashedPw,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const userId = user.insertedId;

  // Create pets
  const pets = await mongoose.connection.db.collection("pets").insertMany([
    { userId, name: "Buddy", type: "dog", emoji: "🐶", age: 3, notes: "Loves dry kibble. Half cup per meal.", createdAt: new Date(), updatedAt: new Date() },
    { userId, name: "Whiskers", type: "cat", emoji: "🐱", age: 5, notes: "Wet food in the morning, dry at night.", createdAt: new Date(), updatedAt: new Date() },
    { userId, name: "Tweety", type: "bird", emoji: "🐦", age: 2, notes: "Mixed seed blend. Fresh water daily.", createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [buddyId, whiskersId, tweetyId] = Object.values(pets.insertedIds);

  // Create schedules
  await mongoose.connection.db.collection("schedules").insertMany([
    {
      userId, petId: buddyId, label: "Breakfast",
      times: ["07:00"], days: ["mon","tue","wed","thu","fri","sat","sun"],
      notes: "Half cup dry food + fresh water", fedTimes: {}, createdAt: new Date(), updatedAt: new Date()
    },
    {
      userId, petId: buddyId, label: "Dinner",
      times: ["18:00"], days: ["mon","tue","wed","thu","fri","sat","sun"],
      notes: "Half cup dry food", fedTimes: {}, createdAt: new Date(), updatedAt: new Date()
    },
    {
      userId, petId: whiskersId, label: "Breakfast",
      times: ["08:00"], days: ["mon","tue","wed","thu","fri","sat","sun"],
      notes: "One can wet food", fedTimes: {}, createdAt: new Date(), updatedAt: new Date()
    },
    {
      userId, petId: whiskersId, label: "Dinner",
      times: ["19:00"], days: ["mon","tue","wed","thu","fri","sat","sun"],
      notes: "Quarter cup dry food", fedTimes: {}, createdAt: new Date(), updatedAt: new Date()
    },
    {
      userId, petId: tweetyId, label: "Breakfast",
      times: ["07:30", "13:00", "19:00"], days: ["mon","tue","wed","thu","fri","sat","sun"],
      notes: "Seed blend refill if empty", fedTimes: {}, createdAt: new Date(), updatedAt: new Date()
    },
  ]);

  console.log("\n✅ Seed data created!");
  console.log("─────────────────────────────");
  console.log("Test Login:");
  console.log("  Email:    alex@example.com");
  console.log("  Password: password123");
  console.log("─────────────────────────────");
  console.log("Pets: Buddy (🐶), Whiskers (🐱), Tweety (🐦)");
  console.log("Schedules: Multiple daily feeds created\n");

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
