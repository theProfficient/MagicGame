const mongoose = require("mongoose");
const resultModel = require("../model/resultModel");
const adminModel = require("../model/adminModel");
const agentModel = require("../model/agentModel");
const distributorModel = require("../model/distributorModel");
const subDistributorModel = require("../model/subDistributorModel");

const generateResult = async function (req, res) {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    function generateRandomNumber(rangeStart, rangeEnd) {
      var random =
        Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
      return random;
    }

    let results1 = [];
    let results2 = [];
    let results3 = [];

    function updateResults() {
      results1 = [];
      results2 = [];
      results3 = [];

      for (var i = 0; i < 10; i++) {
        var rangeStart1 = 1000 + i * 100;
        var rangeEnd1 = rangeStart1 + 99;
        var number1 = generateRandomNumber(rangeStart1, rangeEnd1);
        results1.push(number1);

        var rangeStart2 = 3000 + i * 100;
        var rangeEnd2 = rangeStart2 + 99;
        var number2 = generateRandomNumber(rangeStart2, rangeEnd2);
        results2.push(number2);

        var rangeStart3 = 5000 + i * 100;
        var rangeEnd3 = rangeStart3 + 99;
        var number3 = generateRandomNumber(rangeStart3, rangeEnd3);
        results3.push(number3);
      }

      let createResult;
      async function updateDataOfResult() {
        const result = await resultModel.find();
        const dataLength = result.length;

        let drawId = dataLength > 0 ? result[dataLength - 1].DrawID + 1 : 1;

        const series1 = {
          ID: drawId * 2 - 1,
          rcdt: `${formattedDate}T${formattedTime}`,
          result: results1.join(),
          DrawID: drawId,
          SeriesID: 1,
          drawtimeFULL: formattedTime,
          drawdate1: formattedDate,
          drawtime: formattedTime,
        };

        const series2 = {
          ID: drawId * 2,
          rcdt: `${formattedDate}T${formattedTime}`,
          result: results2.join(),
          DrawID: drawId,
          SeriesID: 2,
          drawtimeFULL: formattedTime,
          drawdate1: formattedDate,
          drawtime: formattedTime,
        };

        const series3 = {
          ID: drawId * 2 + 1,
          rcdt: `${formattedDate}T${formattedTime}`,
          result: results3.join(),
          DrawID: drawId,
          SeriesID: 3,
          drawtimeFULL: formattedTime,
          drawdate1: formattedDate,
          drawtime: formattedTime,
        };

        const createResultArray = [series1, series2, series3];

        createResult = await resultModel.insertMany(createResultArray);

        console.log("Updating result in the database =======");
        console.log(createResult);
      }

      updateDataOfResult();
    }

    updateResults(); // Generate initial results
    setInterval(updateResults, 15 * 60 * 1000); // Update results every 30 minutes

    return res.status(200).json({ message: "Result declared" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { generateResult };
