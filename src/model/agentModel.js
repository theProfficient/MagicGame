const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        balance:{
            type:Number,
            default:0
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
        }]

    },
    {timestamps:true}
);

module.exports = mongoose.model("AgentData", agentSchema);