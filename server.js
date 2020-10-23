const express = require("express");
require("express-async-errors");
const app = express();
const json2xls = require('json2xls');
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const routes = require("./routes/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database/database");
const log4js = require("log4js");

log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");
const {
  setIntervalAsync,
  clearIntervalAsync 
} = require('set-interval-async/dynamic')
 


app.use(cors());

// parse application/json
app.use(bodyParser.json());

//  Connect all our routes to our application
app.use("/api", routes);


// After a Month Reset The Monthly Database 262974600 is a Month in milliseconds
setIntervalAsync(
  async () => {
    await db("monthlyexcel").delete("*");
    let xls = json2xls([{}]);
    await writeFile('./uploads/monthly.xlsx', xls, 'binary');
    console.log("Monthly database reset")
    logger.info("Monthly Database reset")
  },
  262974600
)
// Turn on that server!
app.listen(5000, () => {
  console.log("App listening on port 5000");
});
