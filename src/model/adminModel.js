const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    balance: {
      type: Number,
      default: 0,
    },
    banned:{
      type:Boolean,
      default:false
     },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
