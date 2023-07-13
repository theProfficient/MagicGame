const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const agentModel = require("../model/agentModel");
const adminModel = require("../model/adminModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");

const createUser = async function (req, res) {
  try {
    let bodyData = req.body;
    let {
      username,
      IMEIno,
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
    let checkUser = await userModel.findOne({ username: username });
    if (checkUser != null && checkUser != undefined) {
      return res.status(200).send({
        status: true,
        message: "with this userName user is already exist",
        data: checkUser,
      });
    }

    if (createdBy === "admin") {
      if (!adminId || !agentId) {
        return res.status(400).send({
          status: false,
          messge: "Both adminId and agent id is required",
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
      const checkAgent = await agentModel.findById({
        _id: agentId,
        banned: false,
      });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);
      return res.status(201).json(userCreated);
    }

    if (createdBy === "distributor") {
      if (!distributorId || !agentId) {
        return res.status(400).send({
          status: false,
          messge: "Both distributorId and agent id is required",
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
      const checkAgent = await agentModel.findById({
        _id: agentId,
        banned: false,
      });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);
      return res.status(201).json(userCreated);
    }

    if (createdBy === "subDistributor") {
      if (!subDistributorId || !agentId) {
        return res.status(400).send({
          status: false,
          messge: "Both subDistributorId and agent id is required",
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
      const checkAgent = await agentModel.findById({
        _id: agentId,
        banned: false,
      });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);

      return res.status(201).json(userCreated);
    }

    if (createdBy === "agent") {
      const checkAgent = await agentModel.findById({
        _id: agentId,
        banned: false,
      });

      if (!checkAgent) {
        return res.status(400).send({
          status: false,
          message: "No one is present as per this agent id",
        });
      }
      const userCreated = await userModel.create(bodyData);
      return res.status(201).json(userCreated);
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
//________________________________get userData____________________________

const getUser = async function (req, res) {
  try {
    let userId = req.query.userId;
    if (userId && !mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "invalid id" });
    }
    if (userId) {
      let getNserName = await userModel.findById({
        _id: userId,
        banned: false,
      });

      if (!getNserName) {
        return res.status(404).send({
          status: false,
          message: "user not found",
        });
      }
      return res.status(200).json(getNserName);
    }
    const allData = await userModel.find({ banned: false });
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

//____________________login the client with IMEIno________________________

const loginClientWithIMEI = async function (req, res) {
  try {
    let queryData = req.query;

    let { username, password, IMEIno } = queryData;

    if (!username || !password || !IMEIno) {
      return res.status(400).send({
        status: false,
        message: "username, password and IMEIno all are required",
      });
    }

    let isUserExist = await userModel.findOne({
      username: username,
      password: password,
      banned: false,
    });

    if (!isUserExist) {
      return res.status(404).send({
        Status: "False",
        Message: "Invalid Credential",
        CustomerID: " ",
        BALANCE_POINTS: " ",
        CustomerName: " ",
        AgentID: " ",
        version: "13",
      });
    }
    if (isUserExist.IMEIno === "") {
      isUserExist.IMEIno = IMEIno;
      const updateIMEIno = await isUserExist.save();
      return res.status(200).send({
        Status: "True",
        Message: "Logged in successfully",
        CustomerID: updateIMEIno._id,
        BALANCE_POINTS: updateIMEIno.balance,
        CustomerName: updateIMEIno.username,
        AgentID: updateIMEIno.agentId,
        version: "13",
      });
    }
    if (isUserExist.IMEIno === IMEIno) {
      return res.status(200).send({
        Status: "True",
        Message: "success",
        CustomerID: isUserExist._id,
        BALANCE_POINTS: isUserExist.balance,
        CustomerName: isUserExist.username,
        AgentID: isUserExist.agentId,
        version: "13",
      });
    } else {
      return res.status(400).send({
        Status: "False",
        Message: "This client is already logged in with another device",
        CustomerID: " ",
        BALANCE_POINTS: " ",
        CustomerName: " ",
        AgentID: " ",
        version: "13",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//____________________________updateUser Data__________________________

// const updateUser = async function (req, res) {
//   try {
//     const userId = req.query.userId;
//     const queryData = req.query;
//     const {
//       agentId,
//       subDistributorId,
//       distributorId,
//       adminId,
//       password,
//       balance,
//       banned,
//     } = queryData;
//     let updatedUser;

//     if (userId && !mongoose.isValidObjectId(userId)) {
//       return res.status(400).send({ status: false, message: "Invalid ID" });
//     }

//     let getUser = await userModel.findById(userId);

//     if (!getUser || getUser.banned) {
//       return res
//         .status(404)
//         .send({ status: false, message: "User not found or banned" });
//     }

//     const createdBy = getUser.createdBy;

//     if (adminId) {
//       const checkadmin = await adminModel.findById({
//         _id: adminId,
//         banned: false,
//       });

//       if (!checkadmin || checkadmin.password !== password) {
//         return res.status(400).send({
//           status: false,
//           message: "You are not authorized to update user data",
//         });
//       }

//       const updateObject = {};

//       if (balance && !getUser.banned) {
//         const adminBalance = checkadmin.balance;
//         if (adminBalance < balance) {
//           return res.status(400).send({
//             status: false,
//             message: "Admin has insufficient balance ",
//           });
//         }
//         updateObject.balance = getUser.balance + Number(balance);
//       }

//       if (banned) {
//         updateObject.banned = banned;
//       }
//       if (createdBy === "admin" && getUser.adminId.toString() === adminId) {
//         updatedUser = await userModel.findOneAndUpdate(
//           { _id: userId, adminId: adminId },
//           updateObject,
//           { new: true }
//         );
//       } else if (createdBy === "distributor") {
//         let distributorId = getUser.distributorId;
//         let distributorData = await distributorModel.findById({
//           _id: distributorId,
//         });
//         if (distributorData.adminId.toString() === adminId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       } else if (createdBy === "subDistributor") {
//         let subDistributorId = getUser.subDistributorId;
//         let subDistributorData = await subDistributorModel.findById({
//           _id: subDistributorId,
//         });
//         let distributorId = subDistributorData.distributorId;
//         let distributorData = await distributorModel.findById({
//           _id: distributorId,
//         });
//         if (distributorData.adminId.toString() === adminId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       } else if (createdBy === "agent") {
//         let agentId = getUser.agentId;
//         let agentData = await agentModel.findById({
//           _id: agentId,
//         });
//         let subDistributorId = agentData.subDistributorId;
//         let subDistributorData = await subDistributorModel.findById({
//           _id: subDistributorId,
//         });
//         let distributorId = subDistributorData.distributorId;
//         let distributorData = await distributorModel.findById({
//           _id: distributorId,
//         });
//         if (distributorData.adminId.toString() === adminId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       }
//       const updateAdminBalance = await adminModel.findByIdAndUpdate(
//         { _id: adminId },
//         { $inc: { balance: -balance } },
//         { new: true }
//       );
//     }

//     if (distributorId) {
//       const checkdistributor = await distributorModel.findById({
//         _id: distributorId,
//         banned: false,
//       });

//       if (!checkdistributor || checkdistributor.password !== password) {
//         return res.status(400).send({
//           status: false,
//           message: "You are not authorized to update user data",
//         });
//       }

//       const updateObject = {};

//       if (balance && !getUser.banned) {
//         const distributorBalance = checkdistributor.balance;
//         if (distributorBalance < balance) {
//           return res.status(400).send({
//             status: false,
//             message: "distributor has insufficient balance ",
//           });
//         }
//         updateObject.balance = getUser.balance + Number(balance);
//       }

//       if (banned) {
//         updateObject.banned = banned;
//       }

//       if (
//         createdBy === "distributor" &&
//         getUser.distributorId.toString() === distributorId
//       ) {
//         updatedUser = await userModel.findOneAndUpdate(
//           { _id: userId, distributorId: distributorId },
//           updateObject,
//           { new: true }
//         );
//       } else if (createdBy === "admin") {
//         console.log("created by subDistributor>>>>>>>>>>>>>>>>");
//         let adminId = getUser.adminId;
//         if (checkdistributor.adminId.toString() === adminId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       } else if (createdBy === "subDistributor") {
//         console.log("created by subDistributor>>>>>>>>>>>>>>>>");
//         let subDistributorId = getUser.subDistributorId;
//         let subDistributorData = await subDistributorModel.findById({
//           _id: subDistributorId,
//         });
//         if (subDistributorData.distributorId.toString() === distributorId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       } else if (createdBy === "agent") {
//         console.log("created by agent>>>>>>>>>>>>>>>>");
//         const agentId = getUser.agentId;
//         const agentData = await agentModel.findById({
//           _id: agentId,
//         });
//         let subDistributorId = agentData.subDistributorId;
//         let subDistributorData = await subDistributorModel.findById({
//           _id: subDistributorId,
//         });
//         if (subDistributorData.distributorId.toString() === distributorId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       }
//       const updateDistributorBalance = await distributorModel.findByIdAndUpdate(
//         { _id: distributorId },
//         { $inc: { balance: -balance } },
//         { new: true }
//       );
//     }

//     if (subDistributorId) {
//       const checksubDistributor = await subDistributorModel.findById({
//         subDistributorId,
//         banned: false,
//       });

//       if (!checksubDistributor || checksubDistributor.password !== password) {
//         return res.status(400).send({
//           status: false,
//           message: "You are not authorized to update user data",
//         });
//       }

//       const updateObject = {};

//       if (balance && !getUser.banned) {
//         const subDistributorBalance = checksubDistributor.balance;
//         if (subDistributorBalance < balance) {
//           return res.status(400).send({
//             status: false,
//             message: "subdistributor has insufficient balance ",
//           });
//         }
//         updateObject.balance = getUser.balance + Number(balance);
//       }

//       if (banned) {
//         updateObject.banned = banned;
//       }

//       if (
//         createdBy === "subDistributor" &&
//         getUser.subDistributorId.toString() === subDistributorId
//       ) {
//         updatedUser = await userModel.findOneAndUpdate(
//           { _id: userId, subDistributorId: subDistributorId },
//           updateObject,
//           { new: true }
//         );
//       } else if (createdBy === "admin") {
//         let distributorId = checksubDistributor.distributorId;
//         let distributorData = await distributorModel.findById({
//           _id: distributorId,
//         });
//         if (distributorData.adminId.toString() === getUser.adminId.toString()) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       } else if (createdBy === "agent") {
//         const agentId = getUser.agentId;
//         const agentData = await agentModel.findById({
//           _id: agentId,
//         });
//         if (agentData.subDistributorId.toString() === subDistributorId) {
//           updatedUser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             updateObject,
//             { new: true }
//           );
//         }
//       }
//       const updateSubDistributorBalance =
//         await subDistributorModel.findByIdAndUpdate(
//           { _id: subDistributorId },
//           { $inc: { balance: -balance } },
//           { new: true }
//         );
//     }

//     if (agentId) {
//       const checkAgent = await agentModel.findById({
//         _id: agentId,
//         banned: false,
//       });

//       if (!checkAgent || checkAgent.password !== password) {
//         return res.status(400).send({
//           status: false,
//           message: "You are not authorized to update user data",
//         });
//       }

//       const updateObject = {};

//       if (balance && !getUser.banned) {
//         const agentBalance = checkAgent.balance;
//         if (agentBalance < balance) {
//           return res.status(400).send({
//             status: false,
//             message: "agent has insufficient balance ",
//           });
//         }
//         updateObject.balance = getUser.balance + Number(balance);
//       }

//       if (banned) {
//         updateObject.banned = banned;
//       }

//       if (
//         (createdBy === "agent" ||
//           createdBy === "subDistributor" ||
//           createdBy === "distributor" ||
//           createdBy === "admin") &&
//         getUser.agentId.toString() === agentId
//       ) {
//         updatedUser = await userModel.findOneAndUpdate(
//           { _id: userId, agentId: agentId },
//           updateObject,
//           { new: true }
//         );
//       }
//       const updateAgentBalance = await agentModel.findByIdAndUpdate(
//         { _id: agentId },
//         { $inc: { balance: -balance } },
//         { new: true }
//       );
//     }

//     if (!updatedUser) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

const updateUser = async function (req, res) {
  try {
    const userId = req.query.userId;
    const queryData = req.query;
    const {
      agentId,
      subDistributorId,
      distributorId,
      adminId,
      password,
      balance,
      banned,
    } = queryData;
    let updatedUser;

    if (userId && !mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid ID" });
    }

    let getUser = await userModel.findById(userId);

    if (!getUser || getUser.banned) {
      return res
        .status(404)
        .send({ status: false, message: "User not found or banned" });
    }

    const createdBy = getUser.createdBy;

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

      if (balance && !getUser.banned) {
        const adminBalance = checkadmin.balance;
        if (adminBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "Admin has insufficient balance ",
          });
        }
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }
      if (createdBy === "admin" && getUser.adminId.toString() === adminId) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, adminId: adminId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "distributor") {
        let distributorId = getUser.distributorId;
        let distributorData = await distributorModel.findById({
          _id: distributorId,
        });
        if (distributorData.adminId.toString() === adminId) {
          updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            updateObject,
            { new: true }
          );
        }
      } else if (createdBy === "subDistributor") {
        // console.log(getUser._id === new);
        const checkAuth = await userModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(userId) },
          },
          {
            $lookup: {
              from: "subdistributors",
              localField: "subDistributorId",
              foreignField: "_id",
              as: "subDistributor",
            },
          },
          {
            $lookup: {
              from: "distributordatas",
              localField: "subDistributor.distributorId",
              foreignField: "_id",
              as: "distributor",
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "distributor.adminId",
              foreignField: "_id",
              as: "admin",
            },
          },
          {
            $match: { "admin._id": mongoose.Types.ObjectId(adminId) },
          },
          {
            $set: updateObject,
          },
        ]);

        if (!checkAuth || checkAuth.length === 0) {
          return res.status(404).json({
            status: false,
            message: "You are not authorized to update",
          });
        }
        updatedUser = await userModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(userId) },
          { $set: updateObject },
          { new: true }
        );
      } else if (createdBy === "agent") {
        const checkAuth = await userModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(userId) },
          },
          {
            $lookup: {
              from: "agentdatas",
              localField: "agentId",
              foreignField: "_id",
              as: "agent",
            },
          },
          {
            $lookup: {
              from: "subdistributors",
              localField: "agent.subDistributorId",
              foreignField: "_id",
              as: "subDistributor",
            },
          },
          {
            $lookup: {
              from: "distributordatas",
              localField: "subDistributor.distributorId",
              foreignField: "_id",
              as: "distributor",
            },
          },
          {
            $lookup: {
              from: "admins",
              localField: "distributor.adminId",
              foreignField: "_id",
              as: "admin",
            },
          },
          {
            $match: { "admin._id": new mongoose.Types.ObjectId(adminId) },
          },
          {
            $set: updateObject,
          },
        ]);

        if (!checkAuth || checkAuth.length === 0) {
          return res.status(404).json({
            status: false,
            message: "You are not authorized to update",
          });
        }

        updatedUser = await userModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(userId) },
          { $set: updateObject },
          { new: true }
        );
      }
      const updateAdminBalance = await adminModel.findByIdAndUpdate(
        adminId,
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

      if (balance && !getUser.banned) {
        const distributorBalance = checkdistributor.balance;
        if (distributorBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "distributor has insufficient balance ",
          });
        }
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
        createdBy === "distributor" &&
        getUser.distributorId.toString() === distributorId
      ) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, distributorId: distributorId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "admin") {
        console.log("created by subDistributor>>>>>>>>>>>>>>>>");
        let adminId = getUser.adminId;
        if (checkdistributor.adminId.toString() === adminId) {
          updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            updateObject,
            { new: true }
          );
        }
      } else if (createdBy === "subDistributor") {
        console.log("created by subDistributor>>>>>>>>>>>>>>>>");
        let subDistributorId = getUser.subDistributorId;
        let subDistributorData = await subDistributorModel.findById({
          _id: subDistributorId,
        });
        if (subDistributorData.distributorId.toString() === distributorId) {
          updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            updateObject,
            { new: true }
          );
        }
      } else if (createdBy === "agent") {
        const checkAuth = await userModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(userId) },
          },
          {
            $lookup: {
              from: "agentdatas",
              localField: "agentId",
              foreignField: "_id",
              as: "agent",
            },
          },
          {
            $lookup: {
              from: "subdistributors",
              localField: "agent.subDistributorId",
              foreignField: "_id",
              as: "subDistributor",
            },
          },
          {
            $lookup: {
              from: "distributordatas",
              localField: "subDistributor.distributorId",
              foreignField: "_id",
              as: "distributor",
            },
          },
          {
            $match: {
              "distributor._id": new mongoose.Types.ObjectId(distributorId),
            },
          },
          {
            $set: updateObject,
          },
        ]);

        if (!checkAuth || checkAuth.length === 0) {
          return res.status(404).json({
            status: false,
            message: "You are not authorized to update",
          });
        }

        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId },
          updateObject,
          { new: true }
        );
      }
      const updateDistributorBalance = await distributorModel.findByIdAndUpdate(
        { _id: distributorId },
        { $inc: { balance: -balance } },
        { new: true }
      );
    }

    if (subDistributorId) {
      const checksubDistributor = await subDistributorModel.findById({
        subDistributorId,
        banned: false,
      });

      if (!checksubDistributor || checksubDistributor.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        const subDistributorBalance = checksubDistributor.balance;
        if (subDistributorBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "subdistributor has insufficient balance ",
          });
        }
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
        createdBy === "subDistributor" &&
        getUser.subDistributorId.toString() === subDistributorId
      ) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, subDistributorId: subDistributorId },
          updateObject,
          { new: true }
        );
      } else if (createdBy === "admin") {
        let distributorId = checksubDistributor.distributorId;
        let distributorData = await distributorModel.findById({
          _id: distributorId,
        });
        if (distributorData.adminId.toString() === getUser.adminId.toString()) {
          updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            updateObject,
            { new: true }
          );
        }
      } else if (createdBy === "agent") {
        const agentId = getUser.agentId;
        const agentData = await agentModel.findById({
          _id: agentId,
        });
        if (agentData.subDistributorId.toString() === subDistributorId) {
          updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            updateObject,
            { new: true }
          );
        }
      }
      const updateSubDistributorBalance =
        await subDistributorModel.findByIdAndUpdate(
          { _id: subDistributorId },
          { $inc: { balance: -balance } },
          { new: true }
        );
    }

    if (agentId) {
      const checkAgent = await agentModel.findById({
        _id: agentId,
        banned: false,
      });

      if (!checkAgent || checkAgent.password !== password) {
        return res.status(400).send({
          status: false,
          message: "You are not authorized to update user data",
        });
      }

      const updateObject = {};

      if (balance && !getUser.banned) {
        const agentBalance = checkAgent.balance;
        if (agentBalance < balance) {
          return res.status(400).send({
            status: false,
            message: "agent has insufficient balance ",
          });
        }
        updateObject.balance = getUser.balance + Number(balance);
      }

      if (banned) {
        updateObject.banned = banned;
      }

      if (
        (createdBy === "agent" ||
          createdBy === "subDistributor" ||
          createdBy === "distributor" ||
          createdBy === "admin") &&
        getUser.agentId.toString() === agentId
      ) {
        updatedUser = await userModel.findOneAndUpdate(
          { _id: userId, agentId: agentId },
          updateObject,
          { new: true }
        );
      }
      const updateAgentBalance = await agentModel.findByIdAndUpdate(
        { _id: agentId },
        { $inc: { balance: -balance } },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//_____________________________________update another user_________________________________________________

const updateBalanceOfAnotherUser = async function (req, res) {
  try {
    const { senderUserId, receiverUserId, password, balance } = req.query;

    if (!senderUserId || !receiverUserId || !password || !balance) {
      return res.status(404).send({
        status: false,
        message:
          "senderUserId, receiverUserId, password, balance  all fields are required",
      });
    }
    if (
      !mongoose.isValidObjectId(senderUserId) ||
      !mongoose.isValidObjectId(receiverUserId)
    ) {
      return res.status(400).send({ status: false, message: "Invalid ID" });
    }
    const checkSenderData = await userModel.findById({
      _id: senderUserId,
      banned: false,
    });

    if (!checkSenderData) {
      return res.status(404).send({
        status: false,
        message: "No data found as per this senderUserId",
      });
    }

    const checkReceiverData = await userModel.findById({
      _id: receiverUserId,
      password: password,
      banned: false,
    });

    if (!checkReceiverData) {
      return res.status(404).send({
        status: false,
        message: "No data found as per this receiverUserId",
      });
    }

    const senderBalance = checkSenderData.balance;
    if (senderBalance < balance) {
      return res
        .status(400)
        .send({ status: false, message: "You have insufficient balance" });
    }
    const updateReceiverBalance = await userModel.findByIdAndUpdate(
      { _id: receiverUserId },
      { $inc: { balance: balance } },
      { new: true }
    );
    const deductSenderBalance = await userModel.findByIdAndUpdate(
      { _id: senderUserId },
      { $inc: { balance: -balance } },
      { new: true }
    );
    const result = {
      senderUserId: senderUserId,
      senderBalance: deductSenderBalance.balance,
      receiverUserId: receiverUserId,
      receiverUserId: receiverUserId,
      receiverBalance: updateReceiverBalance.balance,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//_________________________update ticketData__________________________

const updateTicketData = async function (req, res) {
  try {
    const userId = req.query.userId;

    let {
      drawtime,
      drawid,
      retailerid,
      ticketnumber,
      totalqty,
      totalpoints,
      setnames,
    } = req.query;
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//_____________________get Balance_________________________

const getBalance = async function (req, res) {
  try {
    const username = req.query.username;
    if (!username) {
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    }

    const checkUserName = await userModel.findOne({ username: username });

    if (!checkUserName) {
      return res
        .status(400)
        .send({ status: false, message: "No user is found" });
    }
    let result = [
      {
        CustomerEmailID: checkUserName.username,
        POINTSALLOTTED: checkUserName.pointsAllocated,
        USEDPOINTS: checkUserName.usedPoints,
        REDEEMPOINTS: null,
        BALANCE_POINTS: checkUserName.balance,
        COMMISSION: checkUserName.commision,
        CustomerID: checkUserName.username,
        RETURNED_POINTS: null,
        distsalecomm: null,
        Type: "Retailer",
        type1: "Player",
      },
    ];

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
  loginClientWithIMEI,
  updateUser,
  updateBalanceOfAnotherUser,
  getBalance,
  updateTicketData,
};
