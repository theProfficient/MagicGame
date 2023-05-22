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


//__________________create distributor by admin____________________

const crtDistributorByAdmin = async function (req, res) {
  try {
    let bodyData = req.body;
    // let adminId = req.query.adminId;
    let {
      balance,
      distributorData,
      distributorName,
      distributorId,
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
    const createDistributorData = await distributorModel.create(bodyData);
    const storeInAdminDb = await adminModel.findByIdAndUpdate(
      { _id: adminId },
      {
        $push: {
          distributorData: {
            distributorName: createDistributorData.distributorName,
            distributorId: createDistributorData._id,
            dateOfIssued: new Date(),
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(createDistributorData);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//__________________create subdistributor by admin____________________

const crtSubDistributorByAdmin = async function (req, res) {
  try {
    let bodyData = req.body;
    // let adminId = req.query.adminId;
    let {
      balance,
      subDistributorData,
      subDistributorName,
      subDistributorId,
      dateOfIssued,
      password,
      adminId,
      distributorId
    } = bodyData;

    if (Object.keys(bodyData).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide some data in body" });
    }

    if (!adminId) {
      return res.status(400).send({
        status: false,
        message: "adminId and required",
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
    const createSubDistributorData = await subDistributorModel.create(bodyData);
    const storeInAdminDb = await adminModel.findByIdAndUpdate(
      { _id: adminId },
      {
        $push: {
          subDistributorData: {
            subDistributorName: createSubDistributorData.subDistributorName,
            subDistributorId: createSubDistributorData._id,
            dateOfIssued: new Date(),
          },
        },
      },
      { new: true }
    );

    return res.status(201).json(createSubDistributorData);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};







//________________________________updateAgentByAdmin____________________

const updateDistributorByAdmin = async function (req, res) {
  try {
    const { adminId, password, distributorId, banned, balance } = req.query;

    if (!adminId || !password || !distributorId) {
      return res.status(400).send({
        status: false,
        message: "distributorId, password, and adminId all are required",
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

    const checkDistributor = await distributorModel.findById({ _id: distributorId });
    if (!checkDistributor) {
      return res.status(404).send({
        status: false,
        message: "Distributor not found",
      });
    }

    if (checkDistributor.adminId !== adminId) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to update any data of this disributor",
      });
    }

    const updateObject = {};

    if (balance  && !checkDistributor.banned) {
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

    return res.status(200).json(updateDistributorData);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createAdmin, getAdmin, updateDistributorByAdmin,crtDistributorByAdmin,crtSubDistributorByAdmin};
