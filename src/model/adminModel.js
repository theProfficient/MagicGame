const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    password:{
      type:String,
      required:true
    },
    role: { 
        type: String,
        default: 'admin'
     },
    agentData:[{
        agentId:{
            type:String,
        },
        agentName: {
          type: String,
        },
        dateOfIssued: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
