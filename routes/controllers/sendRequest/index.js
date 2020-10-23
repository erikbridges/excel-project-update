const log4js = require("log4js");

log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) {
    return res.send({
        success: true,
        information: "Welcome to the Circle API!"
    })
}