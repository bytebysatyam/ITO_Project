const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/auth");

// @route POST /api/leads (PUBLIC)
router.post("/", async (req, res) => {
  console.log("HIT:", req.body);
  try {
    const {
      product, quantity, destination, companyName,
      contactPerson, mobile, whatsapp, email,
      paymentTerms, deliveryTerms, loiAvailable,
      specialRequirement, source, chatSummary,
    } = req.body;

    // Duplicate check
    const duplicate = await Lead.findOne({
      mobile: mobile,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (duplicate) {
      return res.status(400).json({ message: "Duplicate lead detected within 24 hours" });
    }

    // Classify lead
    let leadType = "Incomplete";
    if (quantity && destination && companyName && mobile && paymentTerms) {
      leadType = "Hot";
    } else if (quantity && destination && mobile) {
      leadType = "Warm";
    } else if (mobile) {
      leadType = "Cold";
    }

    const lead = await Lead.create({
      product, quantity, destination, companyName,
      contactPerson, mobile, whatsapp, email,
      paymentTerms, deliveryTerms, loiAvailable,
      specialRequirement, source: source || "Website Form",
      chatSummary, leadType,
    });

    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (err) {
    console.log("LEAD ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/leads
router.get("/", protect, async (req, res) => {
  try {
    let leads;
    if (req.user.role === "admin") {
      leads = await Lead.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({ assignedTo: req.user._id }).populate("assignedTo", "name email").sort({ createdAt: -1 });
    }
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/leads/stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const today = await Lead.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    const hot = await Lead.countDocuments({ leadType: "Hot" });
    const warm = await Lead.countDocuments({ leadType: "Warm" });
    const cold = await Lead.countDocuments({ leadType: "Cold" });
    const incomplete = await Lead.countDocuments({ leadType: "Incomplete" });
    const aiLeads = await Lead.countDocuments({ source: "AI Agent" });
    const websiteLeads = await Lead.countDocuments({ source: "Website Form" });
    const pendingFollowUp = await Lead.countDocuments({
      followUpDate: { $lte: new Date() },
      stage: { $nin: ["Closed Won", "Closed Lost"] },
    });
    res.json({ total, today, hot, warm, cold, incomplete, aiLeads, websiteLeads, pendingFollowUp });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/leads/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (req.user.role === "employee" && String(lead.assignedTo?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route PUT /api/leads/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (req.user.role === "employee" && String(lead.assignedTo?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    Object.keys(req.body).forEach((key) => { lead[key] = req.body[key]; });
    await lead.save();
    res.json({ message: "Lead updated", lead });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route PUT /api/leads/:id/assign
router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    lead.assignedTo = req.body.userId;
    await lead.save();
    res.json({ message: "Lead assigned successfully", lead });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route POST /api/leads/:id/reveal
router.post("/:id/reveal", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    const { field } = req.body;
    lead.revealLog.push({ user: req.user._id, field, revealedAt: new Date() });
    await lead.save();
    res.json({ value: lead[field] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;