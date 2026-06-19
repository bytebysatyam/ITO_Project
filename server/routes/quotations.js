const express = require("express");
const router = express.Router();
const Quotation = require("../models/Quotation");
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/auth");

// @route POST /api/quotations
// @desc Employee requests a quotation
router.post("/", protect, async (req, res) => {
  try {
    const {
      leadId, productName, quantity, destination,
      customerExpectedPrice, proposedPrice, baseCost,
      logisticsBuffer, marginNote, paymentTerms, deliveryTerms,
    } = req.body;

    const quotation = await Quotation.create({
      lead: leadId,
      requestedBy: req.user._id,
      productName, quantity, destination,
      customerExpectedPrice, proposedPrice, baseCost,
      logisticsBuffer, marginNote, paymentTerms, deliveryTerms,
      status: "Pending Approval",
      auditLog: [{ action: "Quotation Requested", by: req.user._id, note: "Submitted for approval" }],
    });

    // Update lead stage
    await Lead.findByIdAndUpdate(leadId, { stage: "Quotation Pending Approval" });

    res.status(201).json({ message: "Quotation submitted for approval", quotation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/quotations
// @desc Get all quotations
router.get("/", protect, async (req, res) => {
  try {
    let quotations;
    if (req.user.role === "admin") {
      quotations = await Quotation.find()
        .populate("lead", "product companyName contactPerson")
        .populate("requestedBy", "name email")
        .sort({ createdAt: -1 });
    } else {
      quotations = await Quotation.find({ requestedBy: req.user._id })
        .populate("lead", "product companyName contactPerson")
        .sort({ createdAt: -1 });
    }
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/quotations/:id/approve
// @desc Admin approves quotation
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    quotation.status = "Approved";
    quotation.approvedBy = req.user._id;
    quotation.approvedAt = new Date();
    quotation.approvedPrice = req.body.approvedPrice || quotation.proposedPrice;
    quotation.auditLog.push({ action: "Approved", by: req.user._id, note: req.body.note || "Approved by admin" });

    await quotation.save();
    await Lead.findByIdAndUpdate(quotation.lead, { stage: "Quotation Approved" });

    res.json({ message: "Quotation approved", quotation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/quotations/:id/reject
// @desc Admin rejects quotation
router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    quotation.status = "Rejected";
    quotation.rejectionReason = req.body.reason || "Rejected by admin";
    quotation.auditLog.push({ action: "Rejected", by: req.user._id, note: req.body.reason });

    await quotation.save();
    await Lead.findByIdAndUpdate(quotation.lead, { stage: "Quotation Required" });

    res.json({ message: "Quotation rejected", quotation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;