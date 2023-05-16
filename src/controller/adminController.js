const mongoose = require("mongoose");
const adminModel = require("../model/adminModel");

const createAdmin = async function (req, res) {
  try {
    let queryData = req.query;

    let { adminName } = queryData;

    if (Object.keys(queryData).length == 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  not be Empty please enter some data to create Admin",
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

    const adminCreated = await adminModel.create(queryData);

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
    let adminName = req.query.adminName;

    const getNewAdmin = await adminModel.findOne({ adminName: adminName });

    if (getNewAdmin.length == 0) {
      return res.status(404).send({
        status: false,
        message: "Admin not found",
      });
    }
    return res.status(200).json(getNewAdmin);
  } catch (err) {
    return res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = { createAdmin, getAdmin };
