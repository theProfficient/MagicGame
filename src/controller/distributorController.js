const mongoose = require("mongoose");
const adminModel = require("../model/adminModel");
const agentModel = require("../model/agentModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");
const userModel = require("../model/userModel");

//________________________create distributor______________

const createDistributor = async function (req, res) {
  try {
    let bodyData = req.body;
    let {
      distributorName,
      balance,
      password,
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
      return res.status(400).send({
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
    let checkDistributorName = await distributorModel.findOne({
      distributorName: distributorName
    });
    if (checkDistributorName != null && checkDistributorName != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this agentName user is already exist",
        data: checkDistributorName,
      });
    }

    if (createdBy === "admin") {
      if (!adminId) {
        return res.status(400).send({
          status: false,
          messge: "adminId  is required",
        });
      }
      const checkadmin = await adminModel.findById({ _id: adminId, banned:false });
      if (!checkadmin) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this admin id",
        });
      }
      const distributorCreated = await distributorModel.create(bodyData);
      return res.status(201).json(distributorCreated);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//__________________get distributor data_____________________

const getdistributorData = async function (req, res) {
  try {
    let distributorId = req.query.distributorId;
    if (distributorId && !mongoose.isValidObjectId(distributorId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (distributorId) {
      const getNewDistributor = await distributorModel.findOne({
        _id: distributorId,banned:false
      });

      if (!getNewDistributor) {
        return res.status(404).send({
          status: false,
          message: "Admin not found",
        });
      }
      return res.status(200).json(getNewDistributor);
    }
    const allDistributorData = await distributorModel.find({banned:false});
    if (allDistributorData.length === 0) {
      return res.status(404).send({
        status: false,
        message: "no data found",
      });
    }
    return res.status(200).json(allDistributorData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

//_______________________update distributorData_______________
const updateDistributorData = async function (req, res) {
  try {
    const { adminId, password, distributorId, banned, balance } = req.query;

    if (!adminId || !password || !distributorId) {
      return res.status(400).send({
        status: false,
        message: "distributorId, password, and adminId all are required",
      });
    }

    const checkAdmin = await adminModel.findById({
      _id: adminId,
      password: password,
      banned:false,
    });
    if (!checkAdmin) {
      return res.status(404).send({
        status: false,
        message: "Admin not found",
      });
    }
    const checkDistributor = await distributorModel.findById({
      _id: distributorId,
    });
    if (!checkDistributor) {
      return res.status(404).send({
        status: false,
        message: "Distributor not found or banned",
      });
    }

    if (checkDistributor.adminId.toString() !== adminId) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to update any data of this disributor",
      });
    }

    const updateObject = {};

    if (balance || checkDistributor.banned) {
      const adminBalance = checkAdmin.balance;
      if (adminBalance < balance) {
        return res.status(400).send({
          status: false,
          message: "Admin has insufficient balance ",
        });
      }
      updateObject.balance = checkDistributor.balance + Number(balance);
    }

    if (banned) {
      updateObject.banned = banned;
    }

    const updateDistributorData = await distributorModel.findByIdAndUpdate(
      distributorId,
      updateObject,
      { new: true }
    );
    const updateAdminBalance = await adminModel.findByIdAndUpdate(
      { _id: adminId },
      { $inc: { balance: -balance } },
      { new: true }
    );

    return res.status(200).json(updateDistributorData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = {
  createDistributor,
  getdistributorData,
  updateDistributorData,
};
