const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DistributorData",
    },
    subDistributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubDistributor",
      //required: true
    },
    createdBy: {
      type: String,
    },
    agentName: {
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
      default: "agent",
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentData", agentSchema);
