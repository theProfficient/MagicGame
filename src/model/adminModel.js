const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
    adminName:{
        type:String,
        required:true
    },
    agentData:[{
        agentName:{
            type:String,
            required:true
        },
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