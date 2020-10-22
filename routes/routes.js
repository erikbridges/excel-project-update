const routes = require("express").Router();
const { body } = require('express-validator');
const jwt = require('express-jwt');

// JWT 
require("dotenv").config();
const secret = process.env.JWT_SECRET;


// Controllers 
const excelConvert = require("./controllers/excelConvert");
const registerAdmin = require("./controllers/registerAdmin");
const loginAdmin = require("./controllers/loginAdmin");
const loadExcel = require("./controllers/loadExcel");
const genForgotCode = require("./controllers/genForgotCode");
const genVerifyCode = require("./controllers/genVerifyCode");
const verifyCode = require("./controllers/verifyCode");
const updateAdmin = require("./controllers/updateAdmin");

// Excel Conversion
routes.post("/create-entry",[
    body('name').matches(/[A-Z]+/).withMessage("Invalid Name Section"),
    body('phoneNum').matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i).withMessage("Invalid Phone Number"),
    body("cashApp").matches(/([$A-Z][^\s])/).withMessage("Invalid Cashpapp user"),
    body("numOfSpots").matches(/[0-9]+/).withMessage("Number of Spots must be a number")
], async (req, res) => await excelConvert(req, res));

routes.post("/sign-up",[
    body('email').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).withMessage("Invalid Name Section"),
    body('password').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/).withMessage("Invalid Password, 8 - 30 characters long, must contain a special character and a number."),
], async (req, res) => await registerAdmin(req, res));

routes.post("/login", async (req, res) => await loginAdmin(req, res));

routes.get("/load-excel", jwt({ secret, algorithms: ['HS256'] }), async (req, res) => await loadExcel(req, res));

// Generate Forgot Passcode
routes.post("/forgot-new", async (req, res) => await genForgotCode(req, res));

// Generate Verify Code
routes.get("/verify-new", jwt({ secret, algorithms: ['HS256'] }),  async (req, res) => await genVerifyCode(req, res));

// Verify Code
routes.post("/verify", async (req, res) => await verifyCode(req, res) );

routes.patch("/update-admin", 
    jwt({ secret, algorithms: ['HS256'] }), 
    async (req, res) => await updateAdmin(req, res));

    
module.exports = routes;
