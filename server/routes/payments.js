const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Lead = require("../models/Lead");
const { protect, adminOnly } = require("../middleware/auth");

// @route POST /api/payments
// @desc Create payment entry
router.post("/", protect, async (req, res) => {
  try {
    const balanceAmount = Number(req.body.totalOrderValue) - Number(req.body.advanceAmount || 0);

const payment = await Payment.create({
  ...req.body,
  balanceAmount,
  outstandingAmount: balanceAmount,
  createdBy: req.user._id,
});

    // Update lead stage
    await Lead.findByIdAndUpdate(req.body.lead, { stage: "Payment Pending" });

    res.status(201).json({ message: "Payment entry created", payment });
  } catch (err) {
    console.log("PAYMENT ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/payments
// @desc Get all payments
router.get("/", protect, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("lead", "product companyName contactPerson")
      .populate("dispatch", "truckNumber dispatchStatus")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/payments/stats/summary
// @desc Get payment stats
router.get("/stats/summary", protect, adminOnly, async (req, res) => {
  try {
    const total = await Payment.countDocuments();
    const paid = await Payment.countDocuments({ paymentStatus: "Paid" });
    const overdue = await Payment.countDocuments({ paymentStatus: "Overdue" });
    const pending = await Payment.countDocuments({ paymentStatus: { $in: ["Not Started", "Partial", "Due", "Advance Received"] } });

    // Total outstanding
    const outstanding = await Payment.aggregate([
      { $match: { paymentStatus: { $ne: "Paid" } } },
      { $group: { _id: null, total: { $sum: "$outstandingAmount" } } },
    ]);

    res.json({
      total, paid, overdue, pending,
      totalOutstanding: outstanding[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route PUT /api/payments/:id
// @desc Update payment status
router.put("/:id", protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    Object.keys(req.body).forEach((key) => { payment[key] = req.body[key]; });
    await payment.save();

    // If fully paid, update lead stage
    if (req.body.paymentStatus === "Paid") {
      await Lead.findByIdAndUpdate(payment.lead, { stage: "Closed Won" });
    }

    res.json({ message: "Payment updated", payment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;