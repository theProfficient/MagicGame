const express = require("express");
const Router = express.Router();

const adminController = require("../controller/adminController");
const distributorController = require("../controller/distributorController");
const subDistributorController = require("../controller/subDistributorController");
const agentController = require("../controller/agentControlller");
const userController = require("../controller/userController");
const resultController = require("../controller/resultController")
// const ticketsController = require("../controller/ticketsController");

//__________________________Admin___________

Router.post("/registerAdmin", adminController.createAdmin);
Router.get("/profileOfAdmin", adminController.getAdmin);
Router.get("/updateDataOfAdmin", adminController.updateAdminData);

//__________________________Distributor__________

Router.post("/registerDistributor", distributorController.createDistributor);
Router.get("/profileOfdistributor", distributorController.getdistributorData);
Router.put("/updateDataOfDistributor", distributorController.updateDistributorData);

//__________________________SubDistributor___________

Router.post("/registerSubDistributor", subDistributorController.createSubDistributor);
Router.get("/profileOfSubdistributor", subDistributorController.getSubDistributorData);
Router.put("/updateDataOfSubDistributor", subDistributorController.updateSubDistributorData);


//__________________________Agent___________

Router.post("/registerAgent", agentController.createAgent);
Router.get("/profileOfAgent", agentController.getAgentData);
Router.put("/updateAgentData", agentController.updateUserByAgent);


//_________________________User_________________________

Router.post("/registerUser", userController.createUser);
Router.get("/profileOfUser", userController.getUser);
Router.get("/Home/LoginClient/", userController.loginClientWithIMEI);
Router.put("/updateUserData", userController.updateUser);
Router.put("/updateAnotherUserByUser", userController.updateBalanceOfAnotherUser);
Router.get("/Home/GetSP_GET_POINT_BALANCE",  userController.getBalance);
Router.put("/Home/GetSP_GET_UPDATE_TICKETDATA", userController.updateTicketData);

//____________________________________result ___________________________________________
Router.get("/generateResult",  resultController.generateResult);
Router.get("/Home/Fun_sp_lastresult",  resultController.getLastResult);
Router.get("/Home/Fun_GET_sp_searchresult_datewise", resultController.getResultByDate);

//__________________________tickit________________________

// Router.post("/tickets", ticketsController.createTickits);
// Router.get("/getTickit", ticketsController.getTickits);

Router.all("/**", function (req, res) {
    res.status(404).send({
      status: false,
      message: "Make Sure Your Endpoint is Correct or Not!",
    });
  });
  
  module.exports = Router;
  
