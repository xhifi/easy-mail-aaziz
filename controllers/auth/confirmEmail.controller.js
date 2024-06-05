const { StatusCodes } = require("http-status-codes");
const { redis, pool } = require("../../utils/db");
const { NotFoundError } = require("../../errors");
const { findUserByEmail } = require("../../utils/queries/user.queries");

module.exports = async (req, res) => {
  const { email } = req.query;
  const { code } = req.params;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email ${email} not found.`);
  }

  await redis.connect();
  const cacheCode = await redis.get(email);
  await redis.disconnect();

  if (cacheCode !== code) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid code or code expired.", ref: "http://localhost:8080/auth/refresh-email-verification" });
  }
  await pool.query("UPDATE users SET is_email_verified = $1, email_verified_on = $2 WHERE email = $3", [true, new Date(), email]);
  await redis.connect();
  await redis.del(email);
  await redis.disconnect();

  return res.json({ message: "Code confirmed" });
};
