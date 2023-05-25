const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    },
    createdBy: {
      type: String,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgentData",
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    IMEIno: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    banned: {
      type: Boolean,
      default: false,
    },
    ticketData: [
      {
        drawtime: {
          type: Date,
          // default:new Date()
        },
        drawid: {
          type: String,
        },
        retailerid: {
          type: String,
        },
        ticketnumber: {
          type: Number,
          // default:0
        },
        totalqty: {
          type: Number,
          // default:0
        },
        totalpoints: {
          type: Number,
        },
        number: {
          type: Number,
        },
        qty: {
          type: Number,
        },
        point: {
          type: Number,
        },
        numbers1: {
          type: Number,
        },
        setnames: {
          type: Number,
        },
        IMEIno: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", userSchema);
