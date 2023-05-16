const mongoose = require("mongoose");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const userModel = require("../model/userModel");

const createAgent = async function (req, res) {
  try {
    let bodyData = req.body;
    // let adminId = req.query.adminId;
    let {
      balance,
      usersData,
      userName,
      userId,
      dateOfIssued,
      password,
      adminId,
    } = bodyData;

    if (Object.keys(bodyData).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide some data in body" });
    }

    if (!adminId) {
      return res.status(400).send({
        status: false,
        message: "adminId required",
      });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
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
    const checkAdmin = await adminModel.findById({ _id: adminId });

    if (!checkAdmin) {
      return res.status(400).send({
        status: false,
        message: "No one is present as per this admin id",
      });
    }
    const createAgentData = await agentModel.create(bodyData);
    const storeInAdminDb = await adminModel.findByIdAndUpdate(
      { _id: adminId },
      {
        $push: {
          agentData: {
            agentName: createAgentData.userName,
            agentId: createAgentData._id,
            dateOfIssued: createAgentData.dateOfIssued,
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(createAgentData);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getAgentData = async function (req, res) {
  try {
    const agentId = req.query.agentId;

    if (agentId && !mongoose.isValidObjectId(agentId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (agentId) {
      const agentDataIsExist = await agentModel.findById({ _id: agentId });
      if (!agentDataIsExist) {
        return res
          .status(404)
          .send({ status: false, message: "data is not present in database" });
      }
      return res.status(200).json(agentDataIsExist);
    }

    const getAllAgentData = await agentModel.find();
    return res.status(200).json(getAllAgentData);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// const updateAgentData = async function (req, res) {
//   try {
//     let agentId = req.query.agentId;
//     let queryData = req.query;
//     let { balance, usersData, userName, userId, dateOfIssued } = queryData;

//     if (!mongoose.Types.ObjectId.isValid(agentId)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "invalid agentId" });
//     }

//     const agentDataIsExist = await agentModel.findById({ _id: agentId });
//     if (!agentDataIsExist) {
//       return res.status(404).send({
//         status: false,
//         message: "data is not present per this agentId",
//       });
//     }

//     const updateData = await agentModel.findByIdAndUpdate(
//       { _id: agentId },
//       { $inc: { balance: balance } },
//       { new: true }
//     );
//     return res.status(200).json(updateData);
//   } catch (err) {
//     return res.status(500).send({ status: false, message: err.message });
//   }
// };



//__________________________updateUserByAgent_____________________________

const updateUserByAgent = async function (req, res) {
    try {
      const { agentId, password, userId, banned, balance } = req.query;
  
      if (!userId || !password || !agentId) {
        return res.status(400).send({
          status: false,
          message: "agentId, password, and userId all are required",
        });
      }
  
      const checkAgent = await agentModel.findById({ _id: agentId });
      if (!checkAgent) {
        return res.status(404).send({
          status: false,
          message: "Agent not found",
        });
      }
      if (checkAgent.banned === true) {
        return res.status(404).send({
          status: false,
          message: "This Agent is banned",
        });
      }
  
      if (checkAgent.password !== password) {
        return res.status(403).send({
          status: false,
          message: "You are not authorized to update any data of an agent",
        });
      }
  
      const checkUser = await userModel.findById({ _id: userId });
      if (!checkUser) {
        return res.status(404).send({
          status: false,
          message: "user not found",
        });
      }
      if (checkUser.agentId !== agentId) {
        return res.status(403).send({
          status: false,
          message: "You are not authorized to update any data of any user",
        });
      }
  
      const updateObject = {};
  
      if (balance && !checkUser.banned) {
        updateObject.balance = checkUser.balance + Number(balance);
      }
  
      if (banned) {
        updateObject.banned = banned;
      }
  
      const updateUserData = await userModel.findByIdAndUpdate(
        userId,
        updateObject,
        { new: true }
      );
  
      return res.status(200).json(updateUserData);
    } catch (err) {
      return res.status(500).send({
        status: false,
        error: err.message,
      });
    }
  };

module.exports = { createAgent, getAgentData, updateUserByAgent };
