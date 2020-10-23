const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const db = require("../../../database/database")
const { validationResult } = require("express-validator");
const json2xls = require('json2xls');
const log4js = require("log4js");

log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) {
    try {
        // Validation Result! Return Errors if they are any.
        const isValid = validationResult(req);
        if (isValid.errors.length !== 0) {
          let errorMessages = [];
          isValid.errors.forEach((item) => {
            errorMessages.push(item.msg);
          });
    
          res.statusCode = 400;
          throw new Error(
            "The following 400 Error(s) has occured during the request: " +
              errorMessages
          );
        }
        const { name, phoneNum, cashApp, numOfSpots } = req.body;

        // Create Master Database
        // Insert Item to the Database
        const newEntryMaster = await db("masterexcel").insert({ fullname: name, phonenum: phoneNum, cashapp: cashApp, numofspots:  numOfSpots }).returning("*");

        // Create an Excel File From the Master Database
        let xlsMaster = json2xls(newEntryMaster);
        await writeFile('./uploads/master.xlsx', xlsMaster, 'binary');

        // Create uploads file
        await fs.promises.mkdir('./uploads', { recursive: true });

        // Insert Item to the Monthly database
        const newEntry = await db("monthlyexcel").insert( { fullname: name, phonenum: phoneNum, cashapp: cashApp, numofspots:  numOfSpots }).returning("*");
        
        // Create an Excel File From The Monthly Database
        let xls = json2xls(newEntry);
        await writeFile('./uploads/monthly.xlsx', xls, 'binary');

        // Send Success Response
        res.send({success: true})
    } catch (ex) {
        console.log(ex)
        logger.error(ex);
        return res.send(new Error(ex));
    }

}