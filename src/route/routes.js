const express = require("express");
const Router = express.Router();

const adminController = require("../controller/adminController");
const agentController = require("../controller/agentControlller");
const userController = require("../controller/userController");

//__________________________Admin___________

Router.post("/registerAdmin", adminController.createAdmin);
Router.get("/profileOfAdmin", adminController.getAdmin);


//_________________________User_________________________

Router.post("/registerUser", userController.createUser);
Router.get("/profileOfUser", userController.getUser);



Router.all("/**", function (req, res) {
    res.status(404).send({
      status: false,
      message: "Make Sure Your Endpoint is Correct or Not!",
    });
  });
  
  module.exports = Router;
  
