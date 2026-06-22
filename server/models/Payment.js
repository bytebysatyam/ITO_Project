const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    // References
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    dispatch: { type: mongoose.Schema.Types.ObjectId, ref: "Dispatch", default: null },

    // Amount Details
    totalOrderValue: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ["Not Started", "Advance Received", "Partial", "Due", "Overdue", "Paid", "Disputed"],
      default: "Not Started",
    },

    // Payment Details
    paymentMode: {
      type: String,
      enum: ["NEFT", "RTGS", "Cheque", "Cash", "LC", "DD", "UPI", ""],
      default: "",
    },
    transactionProof: { type: String, default: "" },
    dueDate: { type: Date, default: null },
    paidDate: { type: Date, default: null },

    // Follow-up
    reminderDate: { type: Date, default: null },
    followUpRemark: { type: String, default: "" },

    // Created by
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Payment", PaymentSchema);