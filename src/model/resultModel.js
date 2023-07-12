const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      default:1000
    },
    rcdt: {
      type: String,
      default: new Date()
    },
    result: {
      type: String,
      default: " ",
    },
    DrawID: {
      type: Number,
      default: 100,
    },
    SeriesID:{
      type:Number,
      default:0
     },
     drawtimeFULL:{
       type:String,
       default:""
     },
     drawdate1:{
        type:String,
        default:""
     },
     drawtime:{
        type:String,
        default:""
     },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResultData", resultSchema);
