const mongoose = require("mongoose");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const userController = require("../model/userModel");

const createAgent = async function(req,res){
    try{
        

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
};




module.exports = {createAgent}