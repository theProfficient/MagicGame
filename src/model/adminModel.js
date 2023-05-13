const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
    adminName:{
        type:String,
        required:true
    },
    agentData:[{
        name:{
            type:String,
            required:true
        },
        agentId:{
            type:true,
            required:true,
            unique:true
        },
        dateOfIssued:{
            type:Date
        }
    }]
},
{timestamps:true}
);
module.exports = mongoose.model('Admin', adminSchema);