const { redis } = require("../../utils/db");
const BadRequest = require("../../errors/BadRequestError");
const { comparePassword } = require("../../utils/bcrypt");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../../utils/jwt");
const { findUserByEmail } = require("../../utils/queries/user.queries");
const {
  secrets: { accessTokenExpiry, refreshTokenExpiry, accessTokenSecret },
} = require("../../config");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Email and password are required");
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new BadRequest("Invalid credentials");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new BadRequest("Invalid credentials");
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  await redis.connect();
  await redis.set(`access-${user.id}`, accessToken, { EX: accessTokenExpiry });
  await redis.set(`refresh-${user.id}`, refreshToken, { EX: refreshTokenExpiry });
  await redis.disconnect();

  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenExpiry,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: refreshTokenExpiry,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  });

  delete user.password;
  res.json({ message: "Logged in successfully", user });
};
