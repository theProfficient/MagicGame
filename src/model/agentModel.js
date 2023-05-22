const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
          },
          distributorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Distributor',
          },
        SubDistributorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubDistributor',
            //required: true
          },
        password:{
            type:String,
            required:true
          },
        balance:{
            type:Number,
            default:0
        },
        role: { 
            type: String,
            default: 'agent'
         },
         banned:{
            type:Boolean,
            default:false
           },
        usersData:[{
            userName:{
                type:String,
            },
            userId:{
                type:String,
            },
            dateOfIssued:{
                type:Date,
            },
        }]

    },
    {timestamps:true}
);

module.exports = mongoose.model("AgentData", agentSchema);