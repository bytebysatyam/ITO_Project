const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    userEmail: { type: String, default: "Unknown" },
    action: {
      type: String,
      enum: [
        "Login",
        "Failed Login",
        "Logout",
        "Lead View",
        "Lead Edit",
        "Lead Create",
        "Mobile Reveal",
        "Email Reveal",
        "Quotation Request",
        "Quotation Approval",
        "Quotation Rejection",
        "Document Upload",
        "Document View",
        "Document Download",
        "Export Attempt",
        "Unauthorized Access",
        "User Suspended",
        "Lead Assigned",
        "Dispatch Created",
        "Payment Updated",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);