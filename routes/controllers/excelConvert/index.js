const fs = require("fs");
const Excel = require("exceljs");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);
const delay = require("delay");
const dataWorkbook = new Excel.Workbook();
const masterWorkBook = new Excel.Workbook();
const excelToJson = require("convert-excel-to-json");
const { validationResult } = require("express-validator");

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

      res.status(400);
      throw new Error(
        "The following 400 Error(s) has occured during the request: " +
          errorMessages
      );
    }
    const { name, phoneNum, cashApp, numOfSpots } = req.body;

    let data = dataWorkbook.getWorksheet("data");
    // Check if it already exists if so just load the file otherwise create a new one.
    if (!data) {
      dataWorkbook.addWorksheet("data");
      data = dataWorkbook.getWorksheet("data");
      data.columns = [
        { header: "name", key: "name", width: 32 },
        { header: "phone-number", key: "phoneNum", width: 32 },
        { header: "cash-app", key: "cashApp", width: 32 },
        { header: "number-of-spots", key: "numOfSpots", width: 32 },
      ];
    }

    // Add Item to the data xlsx
    data.addRow({ name, phoneNum, cashApp, numOfSpots });
    await dataWorkbook.xlsx.writeFile("data.xlsx");

    // Add to master excel file
    async function updateXLS(name, phoneNum, cashApp, numOfSpots) {
      let duplicate = false;
      let data;
      // Check if there is already a master excel file
      fs.access("./master.xlsx", fs.F_OK, async (err) => {
        if (err) {
          logger.info("No master excel file. No worries I will create one!");
          data = masterWorkBook.removeWorksheet(1);
          return;
        }
        // file exists load the content and convert to JSON by restoring the master xlsx file
        const loadedMaster = excelToJson({
          sourceFile: "./master.xlsx",
          columnToKey: {
            A: "name",
            B: "phoneNum",
            C: "cashApp",
            D: "numOfSpots",
          },
        });

        const masterList = loadedMaster.master.filter(
          (key) => key.phoneNum !== "phone-number"
        );
        // Update with a clean file
        data = masterWorkBook.removeWorksheet(1);

        // Create a new data excel file
        data = masterWorkBook.addWorksheet("master");
        data.columns = [
          { header: "name", key: "name", width: 32 },
          { header: "phone-number", key: "phoneNum", width: 32 },
          { header: "cash-app", key: "cashApp", width: 32 },
          { header: "number-of-spots", key: "numOfSpots", width: 32 },
        ];

        masterList.forEach(({ name, phoneNum, cashApp, numOfSpots }) => {
          return data.addRow({ name, phoneNum, cashApp, numOfSpots });
        });
        logger.info("Master list loaded!");
      });

      // Clean up the data excel file with a fresh one
      try {
        // Delete the current data excel file
        await unlinkAsync("./data.xlsx");

        // Update with a clean file
        data = dataWorkbook.removeWorksheet(1);

        // Create a new data excel file
        data = dataWorkbook.addWorksheet("data");
        data.columns = [
          { header: "name", key: "name", width: 32 },
          { header: "phone-number", key: "phoneNum", width: 32 },
          { header: "cash-app", key: "cashApp", width: 32 },
          { header: "number-of-spots", key: "numOfSpots", width: 32 },
        ];
        logger.info("New data workbook created!");
        await dataWorkbook.xlsx.writeFile("data.xlsx");
      } catch (err) {
        res.status(500);
        logger.fatal(err);
        throw new Error(err);
      }

      data = masterWorkBook.getWorksheet("master");
      // Check if it already exists if so just load the file otherwise create a new one.
      if (!data) {
        masterWorkBook.addWorksheet("master");
        data = masterWorkBook.getWorksheet("master");
        data.columns = [
          { header: "name", key: "name", width: 32 },
          { header: "phone-number", key: "phoneNum", width: 32 },
          { header: "cash-app", key: "cashApp", width: 32 },
          { header: "number-of-spots", key: "numOfSpots", width: 32 },
        ];
      }
      // Check for duplicate phone numbers or cashapp username
      // (We want to make sure that each user is unique.)
      data.eachRow({ includeEmpty: true }, function (row) {
        if (row.values[2] == phoneNum || row.values[3] == cashApp) {
          // DUPLICATE USER DO NOT ADD THAT TO THE DATABASE!+8
          duplicate = true;
          return;
        }
      });

      // Add the new data to the master excel file
      if (duplicate !== true) {
        data.addRow({ name, phoneNum, cashApp, numOfSpots });
        logger.info("Writing new data to master file");
        await masterWorkBook.xlsx.writeFile("master.xlsx");
      } else {
        res.status(400);
        throw new Error(
          "A duplicate user is detected. Cannot create a new entry."
        );
      }
    }

    // After 10 seconds the master.xlxs file will be updated (DEBUG ONLY, FOR PRODUCTION THIS MUST BE CHANGED!)
    const setAsyncTimeout = async () => {
      // 1000 * 60 * 60 * 24 * 2 - This is 2 days in milliseconds. Each day is 86400 seconds!
      await delay(10000);
      await updateXLS(name, phoneNum, cashApp, numOfSpots);
      logger.info("Item successfully added to master!");
    };
    res.status(200);
    await setAsyncTimeout();
    return;
  } catch (err) {
    logger.error(err);
  }
};
