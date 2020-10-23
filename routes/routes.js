const routes = require("express").Router();
const excelConvert = require("./controllers/excelConvert");
const { body } = require('express-validator');
const monthlyDownload = require("./controllers/monthlyDownload");
const masterDownload = require("./controllers/masterDownload");
// Excel Conversion
routes.post("/",[
    body('name').matches(/[A-Z]+/).withMessage("Invalid Name Section"),
    body('phoneNum').matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i).withMessage("Invalid Phone Number"),
    body("cashApp").matches(/([$A-Z][^\s])/).withMessage("Invalid Cashpapp user"),
    body("numOfSpots").matches(/[0-9]+/).withMessage("Number of Spots must be a number")
], async (req, res) => await excelConvert(req, res));


// Download Excel File Monthly
routes.get("/monthly", async (req, res) => monthlyDownload(req, res))


// Download Excel File Master
routes.get("/master",  async (req, res) => masterDownload(req, res))



module.exports = routes;
