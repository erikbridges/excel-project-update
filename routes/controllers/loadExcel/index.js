const log4js = require("log4js");
const db = require("../../../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) {
  try {
    const userAdmin = await db("useradmin").first();

    return res.send({
      verified: userAdmin.isverified
    })
  } catch (ex) {
    logger.error(ex);
    return res.send(new Error(ex));
  }
}