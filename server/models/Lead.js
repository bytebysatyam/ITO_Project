const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    // Basic Info
    product: { type: String, required: true },
    quantity: { type: String, required: true },
    destination: { type: String, required: true },

    // Contact Info
    companyName: { type: String, default: "" },
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },

    // Business Info
    paymentTerms: { type: String, default: "" },
    deliveryTerms: { type: String, default: "" },
    loiAvailable: { type: Boolean, default: false },
    specialRequirement: { type: String, default: "" },

    // Lead Classification
    leadType: {
      type: String,
      enum: ["Hot", "Warm", "Cold", "Incomplete"],
      default: "Cold",
    },

    // Lead Source
    source: {
      type: String,
      enum: ["AI Agent", "Website Form", "Manual", "WhatsApp"],
      default: "Website Form",
    },

    // CRM Pipeline Stage
    stage: {
      type: String,
      enum: [
        "New Lead",
        "Lead Qualification",
        "Follow-Up",
        "Requirement Captured",
        "Quotation Required",
        "Quotation Pending Approval",
        "Quotation Approved",
        "Negotiation",
        "LOI / PO Pending",
        "Order Confirmed",
        "Dispatch Pending",
        "Payment Pending",
        "Closed Won",
        "Closed Lost",
      ],
      default: "New Lead",
    },

    // Assignment
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Follow-up
    followUpDate: { type: Date, default: null },
    followUpRemarks: { type: String, default: "" },
    callStatus: { type: String, default: "" },
    whatsappStatus: { type: String, default: "" },
    nextAction: { type: String, default: "" },

    // Chat summary from AI
    chatSummary: { type: String, default: "" },

    // Reveal log — who revealed mobile/email
    revealLog: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        field: String,
        revealedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto classify lead based on data
LeadSchema.pre("save", function (next) {
  const lead = this;
  if (
    lead.quantity &&
    lead.destination &&
    lead.companyName &&
    lead.mobile &&
    lead.paymentTerms
  ) {
    lead.leadType = "Hot";
  } else if (lead.quantity && lead.destination && lead.mobile) {
    lead.leadType = "Warm";
  } else if (lead.mobile) {
    lead.leadType = "Cold";
  } else {
    lead.leadType = "Incomplete";
  }
  next();
});

module.exports = mongoose.model("Lead", LeadSchema);