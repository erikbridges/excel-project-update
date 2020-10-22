const log4js = require("log4js");
const cryptoRandomString = require('crypto-random-string');
const bcrypt = require("bcrypt");
const db = require("../../../database/db");
const { validationResult } = require("express-validator");
const sgMail = require('@sendgrid/mail');
const GoogleRecaptcha = require("google-recaptcha");
const googleRecaptcha = new GoogleRecaptcha({
  secret: process.env.GOOGLE_PRIVATE
});

log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) {
    const {email, password, recaptchaValue} = req.body;
    try {
      // Check if an admin already exist.
      const existingAdmin = await db("useradmin").first();
      if (existingAdmin) {
        throw new Error("Admin already exist!")
      }
        // Check Validation Return Errors if they are any.
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

        // Verify Recaptcha
        const isReqHuman = googleRecaptcha.verify({response: recaptchaValue}, error => {
              if (error) {
                return false;
              }
        
              return true;
            });

        if (!isReqHuman) {
            res.statusCode = 400;
            throw new Error("Captcha invalid");
        }
        // Hash
        const salt = await bcrypt.genSalt(15);
        const hashPass = await bcrypt.hash(password, salt)

        const newAdmin = {
            id: cryptoRandomString({length: 8, type: 'alphanumeric'}),
            email,
            passkey: hashPass,
            verifiedcode: cryptoRandomString({length: 10, type: 'alphanumeric'}),
            isverified: false,
            forgotkey: null,
            forgotactive: false,
            
        }

        // Create Admin
        await db("useradmin").insert(newAdmin)
        
        // Send Verify Code 
        // NO INTERNET UNCOMMENT WHEN INTERNET RETURNS
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const secureMessage = {
            to: email,
            from: "admin@excelproject.com",
            subject: "Security Code from The Excel Project DO NOT REPLY",
            text: `Hi, to activate your account copy and paste this code on the settings menu verification section: ${newAdmin.verifiedcode} `
          };
          await sgMail.send(secureMessage);
            // Send Response back
            return res.send({success: true, message: "Please check your email to verify your account."})

    } catch (ex) {
        logger.error(ex);
        return res.send(new Error(ex));
    }
}