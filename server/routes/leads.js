const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/auth");

// @route POST /api/leads
// @desc Create new lead (public - from website form or AI agent)
router.post("/", async (req, res) => {
  try {
    const {
      product, quantity, destination, companyName,
      contactPerson, mobile, whatsapp, email,
      paymentTerms, deliveryTerms, loiAvailable,
      specialRequirement, source, chatSummary,
    } = req.body;

    // Duplicate check
    const duplicate = await Lead.findOne({
      $or: [
        { mobile: mobile },
        { email: email && email !== "" ? email : null },
      ],
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (duplicate) {
      return res.status(400).json({ message: "Duplicate lead detected within 24 hours" });
    }

    const lead = await Lead.create({
      product, quantity, destination, companyName,
      contactPerson, mobile, whatsapp, email,
      paymentTerms, deliveryTerms, loiAvailable,
      specialRequirement, source: source || "Website Form",
      chatSummary,
    });

    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/leads
// @desc Get leads - admin gets all, employee gets assigned only
router.get("/", protect, async (req, res) => {
  try {
    let leads;
    if (req.user.role === "admin") {
      leads = await Lead.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({ assignedTo: req.user._id }).populate("assignedTo", "name email").sort({ createdAt: -1 });
    }
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/leads/stats
// @desc Get lead statistics for admin dashboard
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const today = await Lead.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/leads/:id
// @desc Get single lead
router.get("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Employee can only see assigned leads
    if (req.user.role === "employee" && String(lead.assignedTo?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/leads/:id
// @desc Update lead stage, remarks, follow-up
router.put("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Employee can only update assigned leads
    if (req.user.role === "employee" && String(lead.assignedTo?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      lead[key] = updates[key];
    });

    await lead.save();
    res.json({ message: "Lead updated", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/leads/:id/assign
// @desc Assign lead to employee (admin only)
router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.assignedTo = req.body.userId;
    await lead.save();

    res.json({ message: "Lead assigned successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route POST /api/leads/:id/reveal
// @desc Reveal masked contact info and log it
router.post("/:id/reveal", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const { field } = req.body; // "mobile" or "email"

    // Log the reveal action
    lead.revealLog.push({ user: req.user._id, field, revealedAt: new Date() });
    await lead.save();

    res.json({ value: lead[field] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;