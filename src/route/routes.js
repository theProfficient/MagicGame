const express = require("express");
const Router = express.Router();

const adminController = require("../controller/adminController");
const agentController = require("../controller/agentControlller");
const userController = require("../controller/userController");

//_________________Agent_____________

Router.post("/registerAgent", agentController.createAgent);

Router.get("/getAgentData", agentController.getAgentData);

Router.put("/updateAgenytData", agentController.updateAgentData);

//********************Make sure end point is correct or not**************************** */

Router.all("/**", function (req, res) {
  res.status(400)
    .send({
      status: false,
      message: "Make sure ypur end point is correct or not",
    });
});

module.exports = Router;
