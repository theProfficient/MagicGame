const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdBy: {
      type: String,
    },
    distributorName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "distributor",
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistributorData", distributorSchema);
