const mongoose = require("mongoose");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const userController = require("../model/userModel");

const createAgent = async function(req,res){
    try{
        let bodyData = req.body ;

        let {agentName,balance, usersData, userName, userId, dateOfIssued}=bodyData;

        if(Object.keys(bodyData).length === 0){
            return res.status(400).send({status:false,message:"please provide some data in body"})
        }
     const createAgentData = await agentModel.create(bodyData);
     return res.status(201).json(createAgentData);

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
};

const getAgentData = async function(req,res){
    try{
        const agentId = req.query.agentId ;

        if(agentId && !mongoose.isValidObjectId(agentId)){
            return res.status(400).send({status:false, message:"invalid id"})
        }
        if(agentId){
        const agentDataIsExist = await agentModel.findById({_id:agentId});
        if(!agentDataIsExist){
            return res.status(404).send({status:false, message:"data is not present in database"})
        }
            return res.status(200).json(agentDataIsExist)
        }

        const getAllAgentData = await agentModel.find();
        return res.status(200).json(getAllAgentData);

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }

}

const updateAgentData = async function(req,res){
    try{
        let agentId = req.query.agentId
        let queryData = req.query
        let{balance, usersData, userName, userId, dateOfIssued} = queryData

        if(!mongoose.Types.ObjectId.isValid(agentId)){
            return res.status(400).send({status:false, message:"invalid agentId"})
        }

        const agentDataIsExist = await agentModel.findById({_id:agentId});
        if(!agentDataIsExist){
            return res.status(404).send({status:false, message:"data is not present per this agentId"})
        }
        
        const updateData = await agentModel.findByIdAndUpdate({_id:agentId},{$inc:{balance:balance}},{new:true});
        return res.status(200).json(updateData);

    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports = {createAgent, getAgentData, updateAgentData};