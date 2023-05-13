const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        agentName:{
            type:String,
            required:true,
        },
        usersData:[{
            userName:{
                type:String,
                required:true
            },
            userId:{
                type:String,
                required:true,
                unique:true
            },
            dateOfIssued:{
                type:Date,
                // default:new Date()
            }
        }],
        balance:{
            type:Number,
            default:0
        }
    },
    {timestamps:true}
);

module.exports = mongoose.model("AgentData", agentSchema);