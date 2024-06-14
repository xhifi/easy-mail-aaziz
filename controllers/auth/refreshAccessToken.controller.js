const { redis } = require("../../utils/db");
const { BadRequestError } = require("../../errors");
const { verifyToken, generateAccessToken, generateRefreshToken } = require("../../utils/jwt");
const {
  secrets: { accessTokenSecret, refreshTokenSecret, accessTokenExpiry, refreshTokenExpiry },
} = require("../../config");

module.exports = async (req, res) => {
  const refreshToken = await req.headers["token"];

  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }
  const isRefreshTokenValid = verifyToken(refreshToken, refreshTokenSecret);
  if (!isRefreshTokenValid) {
    throw new BadRequestError("Invalid refresh token");
  }
  refreshToken;

  await redis.connect();
  const cachedToken = await redis.get(`refresh-${isRefreshTokenValid.id}`);
  await redis.disconnect();

  if (cachedToken !== refreshToken) {
    throw new BadRequestError("Refresh Token Expired from cache, login again.");
  }

  const newAccessToken = generateAccessToken({ id: isRefreshTokenValid.id }, accessTokenSecret);
  const newRefreshToken = generateRefreshToken({ id: isRefreshTokenValid.id }, refreshTokenSecret);

  await redis.connect();
  await redis.set(`access-${isRefreshTokenValid.id}`, newAccessToken, { EX: accessTokenExpiry });
  await redis.disconnect();

  res.cookie("accessToken", newAccessToken, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(refreshTokenExpiry) * 1000,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(refreshTokenExpiry) * 1000,
  });

  res.end();
};
