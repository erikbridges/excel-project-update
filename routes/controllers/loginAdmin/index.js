const log4js = require("log4js");
const db = require("../../../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GoogleRecaptcha = require("google-recaptcha");
const { validationResult } = require("express-validator");

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

        const adminUser = await db("useradmin").first();
    
        // Check email is same
        if (adminUser.email !== email) { 
            res.status = 400;
            throw new Error("Invalid email or password")
        }

        // Compare hash
        const isSame = await bcrypt.compare(password, adminUser.passkey);

        if (!isSame) {
            res.status = 400;
            throw new Error("Invalid email or password")
        }

        // Generate a jwt token
        const token = await jwt.sign(
            {
            ...adminUser,
            hash: undefined
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );
       

        return res.send({ success: true, token })
    } catch (ex) {
        console.log(ex)
        logger.error(ex);
        return res.send(new Error(ex));
    }
}