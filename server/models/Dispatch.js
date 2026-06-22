const mongoose = require("mongoose");

const DispatchSchema = new mongoose.Schema(
  {
    // References
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    orderId: { type: String, default: "" },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", default: null },

    // Product Details
    product: { type: String, required: true },
    sizeGrade: { type: String, default: "" },
    quantity: { type: String, required: true },

    // Location
    loadingPoint: { type: String, default: "" },
    destination: { type: String, required: true },
    route: { type: String, default: "" },
    deliveryTerms: { type: String, default: "" },

    // Transport
    truckNumber: { type: String, default: "" },
    driverName: { type: String, default: "" },
    driverContact: { type: String, default: "" },
    transporterName: { type: String, default: "" },
    freightRate: { type: Number, default: 0 },

    // Dates
    loadingDate: { type: Date, default: null },
    dispatchDate: { type: Date, default: null },
    expectedDeliveryDate: { type: Date, default: null },

    // Status
    dispatchStatus: {
      type: String,
      enum: ["Pending", "Truck Assigned", "Loading", "In Transit", "Delivered", "Issue Raised", "Closed"],
      default: "Pending",
    },

    // Proof Documents
    deliveryProof: { type: String, default: "" },
    weighmentSlip: { type: String, default: "" },
    invoiceProof: { type: String, default: "" },
    unloadingProof: { type: String, default: "" },

    // Created by
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispatch", DispatchSchema);