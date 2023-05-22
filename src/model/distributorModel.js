const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            // required: true
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
            default: 'distributor'
         },
         banned:{
            type:Boolean,
            default:false
           },
        subDistributorData:[{
            subDistributorName:{
                type:String,
            },
            subDistributorId:{
                type:String,
            },
            dateOfIssued:{
                type:Date,
            },
        }]

    },
    {timestamps:true}
);

module.exports = mongoose.model("DistributorData", distributorSchema);