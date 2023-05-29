const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");

const createAgent = async function (req, res) {
  try {
    let bodyData = req.body;
    let {
      agentName,
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
        .send({
          status: false,
          message: "Both password and createdBy are required",
        });
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
    let checkAgent = await agentModel.findOne({ agentName: agentName });
    if (checkAgent != null && checkAgent != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this agentName user is already exist",
        data: checkAgent,
      });
    }

    if (createdBy === "admin") {
      if (!adminId || !subDistributorId) {
        return res.status(400).send({
          status: false,
          messge: "Both adminId and subDistributor id is required",
        });
      }
      const checkadmin = await adminModel.findById({
        _id: adminId,
        banned: false,
      });
      console.log(checkadmin);
      if (!checkadmin) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this admin id",
        });
      }
      const checksubDistributor = await subDistributorModel.findById({
        _id: subDistributorId,
        banned: false,
      });

      if (!checksubDistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this subDistributorId",
        });
      }
      const agentCreated = await agentModel.create(bodyData);
      return res.status(201).json(agentCreated);
    }

    if (createdBy === "distributor") {
      if (!distributorId || !subDistributorId) {
        return res.status(400).send({
          status: false,
          messge: "Both distributorId and subDistributor id is required",
        });
      }
      const checkdistributor = await distributorModel.findById({
        _id: distributorId,
        banned: false,
      });

      if (!checkdistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this DistributorId id",
        });
      }
      const checksubDistributor = await subDistributorModel.findById({
        _id: subDistributorId,
        banned: false,
      });

      if (!checksubDistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this subDistributor id",
        });
      }
      const agentCreated = await agentModel.create(bodyData);
      return res.status(201).json(agentCreated);
    }

    if ((createdBy = "subDistributor")) {
      if (!subDistributorId) {
        return res
          .status(400)
          .send({ status: false, messge: " subDistributorId is required" });
      }
      const checksubDistributor = await subDistributorModel.findById({
        _id: subDistributorId,
        banned: false,
      });

      if (!checksubDistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this subDistributor id",
        });
      }
      const agentCreated = await userModel.create(bodyData);

      return res.status(201).json(agentCreated);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//_____________________get agent Data________________________________

const getAgentData = async function (req, res) {
  try {
    const agentId = req.query.agentId;

    if (agentId && !mongoose.isValidObjectId(agentId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (agentId) {
      const agentDataIsExist = await agentModel.findById({
        _id: agentId,
        banned: false,
      });
      if (!agentDataIsExist) {
        return res
          .status(404)
          .send({ status: false, message: "data is not present in database" });
      }
      return res.status(200).json(agentDataIsExist);
    }

    const getAllAgentData = await agentModel.find({ banned: false });
    return res.status(200).json(getAllAgentData);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//__________________________updateUserByAgent_____________________________

const updateUserByAgent = async function (req, res) {
  try {
    const {
      agentId,
      distributorId,
      adminId,
      subDistributorId,
      password,
      banned,
      balance,
    } = req.query;
    let updatedAgent;

    if (!agentId) {
      return res.status(400).send({
        status: false,
        message: "agentId is required",
      });
    }
    if (!mongoose.isValidObjectId(agentId)) {
      return res.status(400).send({ status: false, message: "Invalid ID" });
    }
    const checkAgent = await agentModel.findById({ _id: agentId });
    if (!checkAgent || checkAgent.banned === true) {
      return res.status(404).send({
        status: false,
        message: "Agent not found or banned",
      });
    }
    const createdBy = checkAgent.createdBy;

    if (adminId) {
      const checkadmin = await adminModel.findById({
        _id: adminId,
        banned: false,
      });

      if (!checkadmin || checkadmin.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !checkAgent.banned) {
        const adminBalance = checkadmin.balance;
        if (adminBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "Admin has insufficient balance ",
          });
        }
        updateObject.balance = checkAgent.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }
      if (createdBy === "admin" && checkAgent.adminId.toString() === adminId) {
        console.log(checkadmin, "================");
        updatedAgent = await agentModel.findOneAndUpdate(
          { _id: agentId, adminId: adminId },
          updateObject,
          { new: true }
        );

      } else if (createdBy === "distributor") {
        let distributorId = checkAgent.distributorId;
        let findDistibutor = await distributorModel.findById({
          _id: distributorId,
        });
        if (findDistibutor.adminId.toString() === adminId) {
          updatedAgent = await agentModel.findOneAndUpdate(
            { _id: agentId },
            updateObject,
            { new: true }
          );
        }
      } else if (createdBy === "subDistributor") {
        let subDistributorId = checkAgent.subDistributorId;
        let subDistributor = await subDistributorModel.findById({
          _id: subDistributorId,
        });
        let distributorId = subDistributor.distributorId;
        let findDistibutor = await distributorModel.findById({
          _id: distributorId
        });
        if (findDistibutor.adminId.toString() === adminId) {
          updatedAgent = await agentModel.findOneAndUpdate(
            { _id: agentId },
            updateObject,
            { new: true }
          );
        }
      }
      const updateAdminBalance = await adminModel.findByIdAndUpdate(
        { _id: adminId },
        { $inc: { balance: -balance } },
        { new: true }
      );
    }
    if (distributorId) {
      const checkdistributor = await distributorModel.findById({
        _id: distributorId,
        banned: false,
      });

      if (!checkdistributor || checkdistributor.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !checkAgent.banned) {
        const distributorBalance = checkdistributor.balance;
        if (adminBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "Admin has insufficient balance ",
          });
        }
        updateObject.balance = checkAgent.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (createdBy === "admin") {
        let admin = await distributorModel.findById({
          _id: distributorId,
        });
        if (checkAgent.adminId.toString() === admin.adminId.toString()) {
          updatedAgent = await agentModel.findOneAndUpdate(
            { _id: agentId },
            updateObject,
            { new: true }
          );
        }
      } else if (
        createdBy === "distributor" &&
        checkAgent.distributorId.toString() === distributorId
      ) {
        updatedAgent = await agentModel.findOneAndUpdate(
          { _id: agentId, distributorId: distributorId },
          updateObject,
          { new: true }
        );
      }
      if (createdBy === "subDistributor") {
        let subDistributorId = checkAgent.subDistributorId;
        let distributor = await subDistributorModel.findById({
          _id: subDistributorId
        });
        if (distributor.distributorId.toString() === distributorId) {
          updatedAgent = await agentModel.findOneAndUpdate(
            { _id: agentId },
            updateObject,
            { new: true }
          );
        }
      }
      const updateDistributorBalance = await distributorModel.findByIdAndUpdate(
        { _id: distributorId },
        { $inc: { balance: -balance } },
        { new: true }
      );
    }

    if (subDistributorId) {
      const checkSubDistributor = await subDistributorModel.findById({
        _id: subDistributorId,
        banned: false,
      });

      if (!checkSubDistributor || checkSubDistributor.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !checkSubDistributor.banned) {
        const subDistributorBalance = checkSubDistributor.balance;
        if (subDistributorBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "subdistributor has insufficient balance ",
          });
        }
        updateObject.balance = checkAgent.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
        (createdBy === "admin" ||
          createdBy === "distributor" ||
          createdBy === "subDistributor") &&
        checkAgent.subDistributorId.toString() === subDistributorId
      ) {
        updatedAgent = await agentModel.findOneAndUpdate(
          { _id: agentId, subDistributorId: subDistributorId },
          updateObject,
          { new: true }
        );
        const updateSubDistributorBalance = await subDistributorModel.findByIdAndUpdate(
          { _id: subDistributorId },
          { $inc: { balance: -balance } },
          { new: true }
        );
      }
    }
    if (!updatedAgent) {
      return res
        .status(404)
        .json({ status: false, message: "updatedAgent not found" });
    }

    return res.status(200).json(updatedAgent);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createAgent, getAgentData, updateUserByAgent };
