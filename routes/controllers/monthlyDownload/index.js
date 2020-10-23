
const log4js = require("log4js");

log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) {
    try {
        const file = `./uploads/monthly.xlsx`;
        return res.download(file);
    } catch (ex) {
        console.log(ex)
        logger.error(ex);
        return res.send(new Error(ex));
    }
    
}