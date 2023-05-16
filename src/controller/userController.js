const mongoose = require("mongoose");
const userModel = require("../model/userModel");

const createUser = async function (req, res) {
  try {
    let queryData = req.query

    let { userName, IMEIno, balance } = queryData;

    if (Object.keys(queryData).length === 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  not be Empty plz provide some data to create user",
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

    const userCreated = await userModel.create(queryData);
    return res.status(201).json(userCreated);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getUser = async function (req, res) {
  try {
    let userName = req.query.userName;

    let getNserName = await userModel.findOne({ userName: userName });

    if (getNserName.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user not found",
      });
    }
    return res.status(200).json(getNserName);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createUser, getUser };
