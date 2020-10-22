
const log4js = require("log4js");
const { validationResult } = require("express-validator");
const GoogleRecaptcha = require("google-recaptcha");
const db = require("../../../database/db");
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
    const {editWhich, email, password, recaptchaValue} = req.body;
    try {
       
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
        const userAdmin = await db("useradmin").first();
        switch (editWhich) {
            case "email": {
                    // Change the email address
                    await db("useradmin").update("email", email).where("id", userAdmin.id);
    
                    return res.send({success: true, message: "email successfully updated"})
             
            }
            case "password": {
                // Update the password
                // Hash
                const salt = await bcrypt.genSalt(15);
                const hashPass = await bcrypt.hash(password, salt)
                
                // Uncheck forgot passcode
                    await db("useradmin").update({
                        passkey: hashPass
                    }).where("id", userAdmin.id);
                    
                    return res.send({success: true, message: "password successfully updated"})
                }
               default: {
                    res.statusCode = 400;
                    return res.send({error: true, message: "I can't tell which one to edit!"})
                }
        }

    } catch (ex) {
        console.log(ex)
        logger.error(ex);
        return res.send(new Error(ex));
    }
};