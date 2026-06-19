const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Product Details
    productName: { type: String, required: true },
    quantity: { type: String, required: true },
    destination: { type: String, required: true },

    // Pricing
    customerExpectedPrice: { type: Number, default: 0 },
    proposedPrice: { type: Number, default: 0 },
    baseCost: { type: Number, default: 0 },
    logisticsBuffer: { type: Number, default: 0 },
    marginNote: { type: String, default: "" },

    // Terms
    paymentTerms: { type: String, default: "" },
    deliveryTerms: { type: String, default: "" },

    // Approval
    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Rejected", "Sent to Customer", "Negotiation", "Closed"],
      default: "Draft",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
    approvedPrice: { type: Number, default: 0 },

    // Audit
    auditLog: [
      {
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", QuotationSchema);