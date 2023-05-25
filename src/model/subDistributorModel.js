const mongoose = require("mongoose");

const subDistributorSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DistributorData",
    },
    createdBy: {
      type: String,
    },
    controlledBy: {
      type: String,
    },
    subDistributorName: {
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
      default: "subDistributor",
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubDistributor", subDistributorSchema);
