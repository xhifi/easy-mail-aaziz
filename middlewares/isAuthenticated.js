const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");
const { redis } = require("../utils/db");
const { verifyToken } = require("../utils/jwt");
const {
  secrets: { accessTokenSecret },
} = require("../config");

module.exports = async (req, res, next) => {
  const accessToken = req.headers["authorization"];

  if (!accessToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  const decodedToken = verifyToken(accessToken, accessTokenSecret);

  if (!decodedToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  await redis.connect();
  const token = await redis.get(`access-${decodedToken.id}`);
  await redis.disconnect();
  if (!token) {
    throw new UnauthorizedError("Unauthorized");
  }
  req.userId = decodedToken.id;
  next();
};
