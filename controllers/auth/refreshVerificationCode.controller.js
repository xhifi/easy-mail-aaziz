const { StatusCodes } = require("http-status-codes");
const { redis } = require("../../utils/db");
const sendMail = require("../../utils/nodemailer");
const { findUserByEmail } = require("../../utils/queries/user.queries");

module.exports = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json("Email and code must be present in query params");
  }

  const exists = await findUserByEmail(email);
  if (!exists.email || exists.is_email_verified) {
    return res.status(StatusCodes.BAD_REQUEST).json("Email does not exist or is already verified");
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  await redis.connect();
  await redis.set(email, code, { EX: 60 * 5 }); // 5 minutes
  await redis.disconnect();

  const mailed = await sendMail({
    to: exists.email,
    subject: "Easy Mail AAziz - Email Verification Code",
    text: `Your email verification code is ${code}`,
  });

  return res.status(StatusCodes.OK).json({ message: `Verification code has been sent to your ${mailed.envelope.to[0]}` });
};
