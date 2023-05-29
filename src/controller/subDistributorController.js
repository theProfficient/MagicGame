const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");

const createSubDistributor = async function (req, res) {
  try {
    let bodyData = req.body;
    let {
      subDistributorName,
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
    let checkSubDistributorName = await subDistributorModel.findOne({
      subDistributorName: subDistributorName,
    });
    if (
      checkSubDistributorName != null &&
      checkSubDistributorName != undefined
    ) {
      return res.status(200).send({
        status: true,
        message: "with this agentName user is already exist",
        data: checkSubDistributorName,
      });
    }

    if (createdBy === "admin") {
      if (!adminId || !distributorId) {
        return res.status(400).send({
          status: false,
          messge: "Both adminId and Distributor id is required",
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
      const checkDistributor = await distributorModel.findById({
        _id: distributorId,
        banned: false,
      });

      if (!checkDistributor) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this DistributorId",
        });
      }
      const subDistributorCreated = await subDistributorModel.create(bodyData);
      return res.status(201).json(subDistributorCreated);
    }

    if (createdBy === "distributor") {
      if (!distributorId) {
        return res.status(400).send({
          status: false,
          messge: " distributorId is required",
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
      const subDistributorCreated = await subDistributorModel.create(bodyData);
      return res.status(201).json(subDistributorCreated);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//___________________________get subDistributor DAta ______________________

const getSubDistributorData = async function (req, res) {
  try {
    let subDistributorId = req.query.subDistributorId;
    if (subDistributorId && !mongoose.isValidObjectId(subDistributorId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (subDistributorId) {
      const getNewsubDistributor = await subDistributorModel.findOne({
        _id: subDistributorId,
        banned: false,
      });

      if (!getNewsubDistributor) {
        return res.status(404).send({
          status: false,
          message: "Admin not found",
        });
      }
      return res.status(200).json(getNewsubDistributor);
    }
    const allSubDistributorData = await subDistributorModel.find({
      banned: false,
    });
    if (allSubDistributorData.length === 0) {
      return res.status(404).send({
        status: false,
        message: "no data found",
      });
    }
    return res.status(200).json(allSubDistributorData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};
//____________________update subDistributor data_______________

const updateSubDistributorData = async function (req, res) {
  try {
    const {
      distributorId,
      adminId,
      password,
      balance,
      banned,
      subDistributorId,
    } = req.query;

    let updatedSubDistributor;

    if (!subDistributorId) {
      return res
        .status(400)
        .send({ status: false, message: "subDistributorId is required" });
    }
    if (!mongoose.isValidObjectId(subDistributorId)) {
      return res.status(400).send({ status: false, message: "Invalid ID" });
    }

    let getUsubDistributor = await subDistributorModel.findById({
      _id: subDistributorId,
    });

    if (!getUsubDistributor || getUsubDistributor.banned) {
      return res
        .status(404)
        .send({ status: false, message: "subDistributor not found or banned" });
    }

    const createdBy = getUsubDistributor.createdBy;

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

      if (balance && !getUsubDistributor.banned) {
        const adminBalance = checkadmin.balance;
        if (adminBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "Admin has insufficient balance ",
          });
        }
        updateObject.balance = getUsubDistributor.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
        createdBy === "admin" &&
        getUsubDistributor.adminId.toString() === adminId
      ) {
        console.log(checkadmin, "================");
        updatedSubDistributor = await subDistributorModel.findOneAndUpdate(
          { _id: subDistributorId, adminId: adminId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "distributor") {
        let distributorId = getUsubDistributor.distributorId;
        let distributorData = await distributorModel.findOne({
          _id: distributorId,
        });
        if (distributorData.adminId.toString() === adminId) {
          updatedSubDistributor = await subDistributorModel.findOneAndUpdate(
            { _id: subDistributorId },
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

      if (balance && !getUsubDistributor.banned) {
        const distributorBalance = checkdistributor.balance;
        if (distributorBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "distributor has insufficient balance ",
          });
        }
        updateObject.balance = getUsubDistributor.balance + Number(balance);
      }
      if (banned) {
        updateObject.banned = banned;
      }

      if (
        (createdBy === "admin" || createdBy === "distributor") &&
        getUsubDistributor.distributorId.toString() === distributorId
      ) {
        updatedSubDistributor = await subDistributorModel.findOneAndUpdate(
          { _id: subDistributorId, distributorId: distributorId },
          updateObject,
          { new: true }
        );
      }
        const updateDistributorBalance =
          await distributorModel.findByIdAndUpdate(
            { _id: distributorId },
            { $inc: { balance: -balance } },
            { new: true }
          );
    }

    if (!updatedSubDistributor) {
      return res
        .status(404)
        .json({ status: false, message: "SubDistributor not found" });
    }

    return res.status(200).json(updatedSubDistributor);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createSubDistributor,
  getSubDistributorData,
  updateSubDistributorData,
};
