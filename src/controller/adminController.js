const mongoose = require("mongoose");
const adminModel = require("../model/adminModel");
const agentModel = require("../model/agentModel");

const createAdmin = async function (req, res) {
  try {
    let bodyData = req.body;

    let { adminName, password } = bodyData;

    if (Object.keys(bodyData).length == 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  not be Empty please enter some data to create Admin",
      });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "password should have at least 8 characters long, one uppercase, one lowercase, one digit and one special character(optional)",
      });
    }
    let checkAdmin = await adminModel.findOne({ adminName: adminName });

    if (checkAdmin != null && checkAdmin != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this name Admin is already exist",
        data: checkAdmin,
      });
    }

    const adminCreated = await adminModel.create(bodyData);

    return res.status(201).json(adminCreated);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//_____________________________get Admin___________

const getAdmin = async function (req, res) {
  try {
    let adminId = req.query.adminId;
    if (adminId && !mongoose.isValidObjectId(adminId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (adminId) {
      const getNewAdmin = await adminModel.findOne({ _id: adminId });

      if (!getNewAdmin) {
        return res.status(404).send({
          status: false,
          message: "Admin not found",
        });
      }
      return res.status(200).json(getNewAdmin);
    }
    const allAdminData = await adminModel.find();
    if (allAdminData.length === 0) {
      return res.status(404).send({
        status: false,
        message: "no data found",
      });
    }
    return res.status(200).json(allAdminData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

//________________________________updateAgentByAdmin____________________

const updateAgentByAdmin = async function (req, res) {
  try {
    const { adminId, password, agentId, banned, balance } = req.query;

    if (!adminId || !password || !agentId) {
      return res.status(400).send({
        status: false,
        message: "agentId, password, and adminId all are required",
      });
    }

    const checkAdmin = await adminModel.findById({ _id: adminId });
    if (!checkAdmin) {
      return res.status(404).send({
        status: false,
        message: "Admin not found",
      });
    }

    if (checkAdmin.password !== password) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to update any data of an agent",
      });
    }

    const checkAgent = await agentModel.findById({ _id: agentId });
    if (!checkAgent) {
      return res.status(404).send({
        status: false,
        message: "Agent not found",
      });
    }

    if (checkAgent.adminId !== adminId) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to update any data of an agent",
      });
    }

    const updateObject = {};

    if (balance  && !checkAgent.banned) {
      updateObject.balance = checkAgent.balance + Number(balance);
    }

    if (banned) {
      updateObject.banned = banned;
    }

    const updateAgentData = await agentModel.findByIdAndUpdate(
      agentId,
      updateObject,
      { new: true }
    );

    return res.status(200).json(updateAgentData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createAdmin, getAdmin, updateAgentByAdmin };
