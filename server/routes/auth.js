const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isActive) return res.status(403).json({ message: "Account suspended." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    user.lastLogin = new Date();
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: "admin@indiatradeoverseeas.com" });
    if (adminExists) return res.status(400).json({ message: "Already seeded!" });
    const adminPassword = await bcrypt.hash("ITO@Admin2026", 10);
    const employeePassword = await bcrypt.hash("ITO@Employee2026", 10);
    const admin = await User.create({
      name: "Md Ramiz Raza Khan",
      email: "admin@indiatradeoverseeas.com",
      password: adminPassword,
      role: "admin",
      department: "General",
    });
    const employee = await User.create({
      name: "Test Employee",
      email: "employee@indiatradeoverseeas.com",
      password: employeePassword,
      role: "employee",
      department: "Stone Aggregates",
    });
    res.json({
      message: "Seed successful",
      admin: { email: admin.email, password: "ITO@Admin2026" },
      employee: { email: employee.email, password: "ITO@Employee2026" },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.post("/register", protect, adminOnly, async (req, res) => {
  const { name, email, password, role, department, mobile } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, department, mobile });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/users/:id/suspend", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? "activated" : "suspended"}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;