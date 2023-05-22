const mongoose = require("mongoose");

const subDistributorSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
          },
        distributorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Distributor',
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
            default: 'subDistributor'
         },
         banned:{
            type:Boolean,
            default:false
           },
        agentData:[{
            agentName:{
                type:String,
            },
            agentId:{
                type:String,
            },
            dateOfIssued:{
                type:Date,
            },
        }]

    },
    {timestamps:true}
);

module.exports = mongoose.model("SubDistributor", subDistributorSchema);