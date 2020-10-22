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
    const { email } = req.body;
    try {
        
        const forgotCode = cryptoRandomString({length: 7, type: 'alphanumeric'});

        const adminUser = await db("useradmin").first();
            console.log(email)
         // Check email is same
         if (adminUser.email !== email) { 
            res.status = 200;
            console.log("No email match DEBUG ONLY")
            return res.send({success: true, message: "No email found."})
        }
        // Update forgot code
        await db("useradmin").update({
            forgotkey: forgotCode,
            forgotactive: true
        }).where("id", adminUser.id);

        // NO INTERNET? COMMENT UNTIL THE INTERNET RETURNS
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const secureMessage = {
            to: email,
            from: "admin@excelproject.com",
            subject: "Security Code from The Excel Project DO NOT REPLY",
            text: `Hello! Looks like you forgot your password! Copy and paste this code in the forgot page to change your password. CODE:  ${forgotCode} `
        };

        await sgMail.send(secureMessage);

        // Send Response back
        return res.send({success: true, message: "Forgot code successfully generated!"})
    } catch (ex) {
        logger.error(ex);
        return res.send(new Error(ex));
    }
}