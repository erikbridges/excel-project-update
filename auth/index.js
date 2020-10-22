const jwt = require("jsonwebtoken");
const Bearer = require("permit").Bearer;
const permit = new Bearer({
  query: "access_token"
});
// JWT Authentication Strategy
module.exports = async function(ctx) {
  try {
    // Checks to see if a token even exists.
    const token = permit.check(ctx.request);
    // If it doesn't then reject the response.
    if (!token) {
      permit.fail(ctx.response);
      return false;
    }
    // Verify if it is valid token using jwt.
    const isValidToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isValidToken) {
      return false;
    }
    // Spit out the token if it is valid.
    return { valid: true, token: isValidToken };
  } catch (e) {
    // If there is any error during the process then reject the response.
    return false;
  }
};