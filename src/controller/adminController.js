const mongoose = require("mongoose");
const adminModel = require("../model/adminModel");
const agentModel = require("../model/agentModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel")

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

//_____________________________get Admin___________

const updateAdminData = async function (req, res) {
  try {
    let adminId = req.query.adminId;
    let password = req.query.password;

    if(!adminId || ! password){
      return res.status(400).send({ status: false, message: "Both adminId and password are required" });
    }

    if (!mongoose.isValidObjectId(adminId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
  
      const getNewAdmin = await adminModel.findOne({ _id: adminId });

      if (!getNewAdmin) {
        return res.status(404).send({
          status: false,
          message: "Admin not found",
        });
      }
      const updateObject = {};

      if (balance && !getNewAdmin.banned) {
        updateObject.balance = getNewAdmin.balance + Number(balance);
      }
  
      if (banned) {
        updateObject.banned = banned;
      }
  
      const updateAdminData = await adminModel.findByIdAndUpdate(
        adminId,
        updateObject,
        { new: true }
      );

    return res.status(200).json(allAdminData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createAdmin, getAdmin, updateAdminData };
