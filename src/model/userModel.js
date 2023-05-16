const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
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
        default: 'user'
     },
     banned:{
      type:Boolean,
      default:false
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
