const log4js = require("log4js");
const cryptoRandomString = require('crypto-random-string');
const db = require("../../../database/db");
const sgMail = require('@sendgrid/mail');


log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) { 
    try {
        
        const verifyCode = cryptoRandomString({length: 10, type: 'alphanumeric'});
        
        const adminUser = await db("useradmin").first();

        // Update forgot code
        await db("useradmin").update({
            verifiedcode: verifyCode
        }).where("id", adminUser.id);

        // NO INTERNET UNCOMMENT WHEN INTERNET RETURNS
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const secureMessage = {
            to: adminUser.email,
            from: "admin@excelproject.com",
            subject: "Security Code from The Excel Project DO NOT REPLY",
            text: `Hi, to activate your account copy and paste this code on the settings menu verification section: ${verifyCode} `
        };

        await sgMail.send(secureMessage);

        // Send Response back
        return res.send({success: true, message: "Verify code successfully generated!"})
    } catch (ex) {
        logger.error(ex);
        return res.send(new Error(ex));
    }
}