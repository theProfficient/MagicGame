const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const agentModel = require("../model/agentModel");

const createUser = async function (req, res) {
  try {
    let bodyData = req.body;
    let { userName, IMEIno, balance, password, agentId } = bodyData;

    if (Object.keys(bodyData).length === 0) {
      return res.status(400).send({
        status: false,
        message:
          "Body should  not be Empty plz provide some data to create user",
      });
    }

    if (!agentId) {
      return res.status(400).send({
        status: false,
        message: "agentId required",
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
    let checkUser = await userModel.findOne({ userName: userName });
    if (checkUser != null && checkUser != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this userName user is already exist",
        data: checkUser,
      });
    }
    const checkAgent = await agentModel.findById({ _id: agentId });

    if (!checkAgent) {
      return res.status(400).send({
        status: false,
        message: "No one is present as per this agent id",
      });
    }
    const userCreated = await userModel.create(bodyData);

    const storeInAgentDb = await agentModel.findByIdAndUpdate(
      { _id: agentId },
      {
        $push: {
          usersData: {
            userName: userCreated.userName,
            userId: userCreated._id,
            dateOfIssued: new Date(),
          },
        },
      },
      { new: true }
    );
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

module.exports = { createUser, getUser };
