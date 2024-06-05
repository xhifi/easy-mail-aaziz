const login = require("./login.controller");
const signup = require("./signup.controller");
const refreshEmailVerificationCode = require("./refreshVerificationCode.controller");
const forgotPassword = require("./forgotPassword.controller");
const confirmEmail = require("./confirmEmail.controller");
const refreshAccessToken = require("./refreshAccessToken.controller");
const logout = require("./logout.controller");

module.exports = {
  login,
  signup,
  refreshEmailVerificationCode,
  forgotPassword,
  confirmEmail,
  refreshAccessToken,
  logout,
};
