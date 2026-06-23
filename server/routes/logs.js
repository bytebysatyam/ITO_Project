const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const { protect, adminOnly } = require("../middleware/auth");

// Helper to create log
const createLog = async ({ user, userEmail, action, description, ipAddress, metadata, severity }) => {
  try {
    await ActivityLog.create({ user, userEmail, action, description, ipAddress, metadata, severity: severity || "Low" });
  } catch (err) {
    console.log("Log error:", err.message);
  }
};

// @route POST /api/logs
// @desc Create activity log (internal use)
router.post("/", protect, async (req, res) => {
  try {
    const { action, description, metadata, severity } = req.body;
    await createLog({
      user: req.user._id,
      userEmail: req.user.email,
      action,
      description,
      ipAddress: req.ip,
      metadata,
      severity,
    });
    res.json({ message: "Log created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/logs
// @desc Get all logs (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/logs/stats
// @desc Get security stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await ActivityLog.countDocuments();
    const today = await ActivityLog.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const failedLogins = await ActivityLog.countDocuments({ action: "Failed Login" });
    const reveals = await ActivityLog.countDocuments({ action: { $in: ["Mobile Reveal", "Email Reveal"] } });
    const unauthorized = await ActivityLog.countDocuments({ action: "Unauthorized Access" });
    const critical = await ActivityLog.countDocuments({ severity: "Critical" });
    const high = await ActivityLog.countDocuments({ severity: "High" });

    res.json({ total, today, failedLogins, reveals, unauthorized, critical, high });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
module.exports.createLog = createLog;