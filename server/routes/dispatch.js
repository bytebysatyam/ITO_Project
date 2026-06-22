const express = require("express");
const router = express.Router();
const Dispatch = require("../models/Dispatch");
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/auth");

// @route POST /api/dispatch
// @desc Create dispatch entry
router.post("/", protect, async (req, res) => {
  try {
    const dispatch = await Dispatch.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Update lead stage
    await Lead.findByIdAndUpdate(req.body.lead, { stage: "Dispatch Pending" });

    res.status(201).json({ message: "Dispatch created successfully", dispatch });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/dispatch
// @desc Get all dispatches
router.get("/", protect, async (req, res) => {
  try {
    const dispatches = await Dispatch.find()
      .populate("lead", "product companyName contactPerson")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/dispatch/:id
// @desc Get single dispatch
router.get("/:id", protect, async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .populate("lead", "product companyName contactPerson mobile")
      .populate("createdBy", "name");
    if (!dispatch) return res.status(404).json({ message: "Dispatch not found" });
    res.json(dispatch);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route PUT /api/dispatch/:id
// @desc Update dispatch status
router.put("/:id", protect, async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) return res.status(404).json({ message: "Dispatch not found" });

    Object.keys(req.body).forEach((key) => { dispatch[key] = req.body[key]; });
    await dispatch.save();

    // If delivered, update lead stage
    if (req.body.dispatchStatus === "Delivered") {
      await Lead.findByIdAndUpdate(dispatch.lead, { stage: "Payment Pending" });
    }

    res.json({ message: "Dispatch updated", dispatch });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/dispatch/stats/summary
// @desc Get dispatch stats
router.get("/stats/summary", protect, adminOnly, async (req, res) => {
  try {
    const total = await Dispatch.countDocuments();
    const pending = await Dispatch.countDocuments({ dispatchStatus: "Pending" });
    const inTransit = await Dispatch.countDocuments({ dispatchStatus: "In Transit" });
    const delivered = await Dispatch.countDocuments({ dispatchStatus: "Delivered" });
    res.json({ total, pending, inTransit, delivered });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;