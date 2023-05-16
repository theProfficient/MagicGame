const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
    adminName:{
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
            required:true,
            unique:true
        },
        dateOfIssued:{
            type:Date,
            // default:new Date()
        },
        balance:{
            type:Number,
            default:0
        },
    }]
},
{timestamps:true}
);
module.exports = mongoose.model('Admin', adminSchema);