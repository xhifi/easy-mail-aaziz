const jwt = require("jsonwebtoken");
const {
  secrets: { accessTokenSecret, refreshTokenSecret, accessTokenExpiry, refreshTokenExpiry },
} = require("../../config");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry * 1000 });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry * 1000 });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
