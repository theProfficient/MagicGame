const express = require("express");
const Router = express.Router();

const adminController = require("../controller/adminController");
const agentController = require("../controller/agentControlller");
const userController = require("../controller/userController");

//_________________Admin_____________

//Router.post("/createAdmin", adminController.)

//********************Make sure end point is correct or not**************************** */

Router.all("/**", function (req, res) {
  res.status(400)
    .send({
      status: false,
      message: "Make sure ypur end point is correct or not",
    });
});

module.exports = Router;
