const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");

const createUser = async function (req, res) {
  try {
    let bodyData = req.body;
    let {
      userName,
      IMEIno,
      balance,
      password,
      agentId,
      subDistributorId,
      distributorId,
      adminId,
      createdBy,
    } = bodyData;

    if (Object.keys(bodyData).length === 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  not be Empty plz provide some data to create user",
      });
    }
    // let creatdById;
    if (!password || !createdBy) {
      return res
        .status(400)
        .send({ status: false, message: "Both password and createdBy are required" });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "password should have at least 8 characters long, one uppercase, one lowercase, one digit and one special character(optional)",
      });
    }
    let checkUser = await userModel.findOne({ userName: userName });
    if (checkUser != null && checkUser != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this userName user is already exist",
        data: checkUser,
      });
    }

    if (createdBy === 'admin') {
      if(!adminId || !agentId){
        return res.status(400).send({status:false, messge:"Both adminId and agent id is required"})
      }
      const checkadmin = await adminModel.findById({ _id: adminId, banned:false});
      console.log(checkadmin);
      if (!checkadmin) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this admin id",
        });
      }
      const checkAgent = await agentModel.findById({ _id: agentId, banned:false });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);
      return res.status(201).json(userCreated);
    }

    if (createdBy === 'distributor') {
      if(!distributorId || !agentId){
        return res.status(400).send({status:false, messge:"Both distributorId and agent id is required"})
      }
      const checkdistributor = await distributorModel.findById({
        _id: distributorId, banned:false
      });

      if (!checkdistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this DistributorId id",
        });
      }
        const checkAgent = await agentModel.findById({ _id: agentId, banned:false });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);

      // const storeInDistributorDb = await distributorModel.findByIdAndUpdate(
      //   { _id: distributorId },
      //   {
      //     $push: {
      //       usersData: {
      //         userName: userCreated.userName,
      //         userId: userCreated._id,
      //         dateOfIssued: new Date(),
      //       },
      //     },
      //   },
      //   { new: true }
      // );
      return res.status(201).json(userCreated);
    }

    if (createdBy = "subDistributor") {
      if(!subDistributorId || !agentId){
        return res.status(400).send({status:false, messge:"Both subDistributorId and agent id is required"})
      }
      const checksubDistributor = await subDistributorModel.findById({
        _id: subDistributorId, banned:false
      });

      if (!checksubDistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this subDistributor id",
        });
      }
      const checkAgent = await agentModel.findById({ _id: agentId, banned:false });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);

      return res.status(201).json(userCreated);
    }

    if (createdBy = "agent") {
      const checkAgent = await agentModel.findById({ _id: agentId, banned:false });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);
      return res.status(201).json(userCreated);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
//________________________________get userData____________________________



const getUser = async function (req, res) {
  try {
    let userId = req.query.userId;
    if (userId && !mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (userId) {
      let getNserName = await userModel.findById({ _id: userId });

      if (!getNserName) {
        return res.status(404).send({
          status: false,
          message: "user not found",
        });
      }
      return res.status(200).json(getNserName);
    }
    const allData = await userModel.find();
    if (allData.length === 0) {
      return res.status(404).send({
        status: false,
        message: "user data not found",
      });
    }
    return res.status(200).json(allData);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//____________________________updateUser Data__________________________

const updateUser = async function (req, res) {
  try {
    const userId = req.query.userId;
    const queryData = req.query;
    const {
      agentId,
      subDistributorId,
      distributorId,
      adminId,
      password,
      balance,
      banned,
    } = queryData;
    let updatedUser;
    
    if (userId && !mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid ID" });
    }

    let getUser = await userModel.findById(userId);

    if (!getUser || getUser.banned) {
      return res
        .status(404)
        .send({ status: false, message: "User not found or banned" });
    }

    const createdBy = getUser.createdBy;

    if (adminId) {
      const checkadmin = await adminModel.findById({_id:adminId, banned:false});

      if (!checkadmin || checkadmin.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }
      if (createdBy === "admin" && getUser.adminId.toString() === adminId) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, adminId: adminId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "distributor") {
        let distributorId = getUser.distributorId
        let distributorData = await distributorModel.findById({_id:distributorId, banned:false})
        if(distributorData.adminId.toString() === adminId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      } else if (createdBy === "subDistributor") {
        let subDistributorId = getUser.subDistributorId
        let subDistributorData = await subDistributorModel.findById({_id:subDistributorId, banned:false});
        let distributorId = subDistributorData.distributorId
        let distributorData = await distributorModel.findById({_id:distributorId, banned:false})
        if(distributorData.adminId.toString() === adminId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      } else if (createdBy === "agent") {
        let agentId = getUser.agentId
        let agentData = await agentModel.findById({_id:agentId, banned:false});
        let subDistributorId = agentData.subDistributorId
        let subDistributorData = await subDistributorModel.findById({_id:subDistributorId, banned:false});
        let distributorId = subDistributorData.distributorId
        let distributorData = await distributorModel.findById({_id:distributorId, banned:false})
        if(distributorData.adminId.toString() === adminId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
    }
  }

    if (distributorId) {
      const checkdistributor = await distributorModel.findById({_id:distributorId, banned:false});

      if (!checkdistributor || checkdistributor.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }
      

      if (
        createdBy === "distributor" &&
        getUser.distributorId.toString() === distributorId
      ) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, distributorId: distributorId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "admin") {
        console.log("created by subDistributor>>>>>>>>>>>>>>>>");
        let adminId = getUser.adminId
        if(checkdistributor.adminId.toString() === adminId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
        
      }
      else if (createdBy === "subDistributor") {
        console.log("created by subDistributor>>>>>>>>>>>>>>>>");
        let subDistributorId = getUser.subDistributorId
        let subDistributorData = await subDistributorModel.findById({_id:subDistributorId, banned:false});
        if(subDistributorData.distributorId.toString() === distributorId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      } else if (createdBy === "agent") {
        console.log("created by agent>>>>>>>>>>>>>>>>");
        const agentId = getUser.agentId;
        const agentData = await agentModel.findById({_id:agentId, banned:false})
        let subDistributorId = agentData.subDistributorId
        let subDistributorData = await subDistributorModel.findById({_id:subDistributorId, banned:false});
        if(subDistributorData.distributorId.toString() === distributorId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      }
    }

    if (subDistributorId) {
      const checksubDistributor = await subDistributorModel.findById(
        subDistributorId
      );

      if (!checksubDistributor || checksubDistributor.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
       createdBy === "subDistributor" &&
        getUser.subDistributorId.toString() === subDistributorId
      ) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, subDistributorId: subDistributorId },
          updateObject,
          { new: true }
        );
      }
      else if (createdBy === "admin") {
        let distributorId = checksubDistributor.distributorId;
        let distributorData = await distributorModel.findById({_id:distributorId, banned:false});
        if(distributorData.adminId.toString() === getUser.adminId.toString()){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      } else if (createdBy === "agent") {
        const agentId = getUser.agentId;
        const agentData = await agentModel.findById({_id:agentId, banned:false})
        if(agentData.subDistributorId.toString() === subDistributorId){
          updatedUser = await userModel
          .findOneAndUpdate({ _id: userId }, updateObject, { new: true });
        }
      }
    }

    if (agentId) {
      const checkAgent = await agentModel.findById({_id:agentId, banned:false});

      if (!checkAgent || checkAgent.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if ((createdBy === "agent" || createdBy === "subDistributor" || createdBy === "distributor" || createdBy === "admin") && getUser.agentId.toString() === agentId) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, agentId: agentId },
          updateObject,
          { new: true }
        );
    }
  }

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUser, getUser, updateUser };
