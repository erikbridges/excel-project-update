const log4js = require("log4js");
const db = require("../../../database/db");
const GoogleRecaptcha = require("google-recaptcha");
const bcrypt = require("bcrypt");

const googleRecaptcha = new GoogleRecaptcha({
    secret: process.env.GOOGLE_PRIVATE
  });


log4js.configure({
  appenders: { debug: { type: "file", filename: "debug.log" } },
  categories: { default: { appenders: ["debug"], level: "error" } },
});

const logger = log4js.getLogger("debug");

module.exports = async function (req, res) { 
    try {
        const {verifyCode, password, recaptchaValue} = req.body;
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

        // Verify The User
        const adminUser = await db("useradmin").first();
        // Are we doing the email verification code or the forgot password code?
        if (adminUser.verifiedcode == verifyCode){
            // Email Verification Activation
            // Check Verified Code
            await db("useradmin").update({
                isverified: true,
                verifiedcode: ""
            }).where("id", adminUser.id);
            return res.send({success: true, message: "Successfully verified"})
        }
        if (adminUser.forgotcode == verifyCode && password) {
            // Forgot Password Reset
            // Update the password
            // Hash
            const salt = await bcrypt.genSalt(15);
            const hashPass = await bcrypt.hash(password, salt)
            
            // Uncheck forgot passcode
                await db("useradmin").update({
                    forgotkey: "",
                    forgotactive: false,
                    passkey: hashPass
                }).where("id", adminUser.id);
                return res.send({success: true, message: "password successfully updated"})
           
        }
    } catch (ex) {
        logger.error(ex);
        return res.send(new Error(ex));
    }
}