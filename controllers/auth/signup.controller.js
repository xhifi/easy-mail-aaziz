const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../errors");
const { findUserByEmail, createUser } = require("../../utils/queries/user.queries");
const validate = require("../../utils/zod/validate");
const schema = require("./schema/signup.schema");
const sendMail = require("../../utils/nodemailer");
const { redis } = require("../../utils/db");
const { hashPassword } = require("../../utils/bcrypt");

module.exports = async (req, res) => {
  validate(schema, req.body);

  const exists = await findUserByEmail(req.body.email);
  if (exists) {
    throw new BadRequestError("Email already exists");
  }
  const created = await createUser({ ...req.body, password: await hashPassword(req.body.password) });

  const code = Math.floor(100000 + Math.random() * 900000);
  await redis.connect();
  const cacheCode = await redis.set(created.email, code, { EX: 60 * 5 });
  await redis.disconnect();

  if (cacheCode !== "OK") {
    throw new Error("Failed to set verification code");
  }
  const msg = `Your verification code is: ${code}`;
  const emailVerificationCode = await sendMail({
    to: created.email,
    subject: "Easy Mail AAziz - Verification Code",
    text: msg,
    html: "<p>" + msg + "</p>",
  });
  delete created.password;

  return res.status(StatusCodes.CREATED).json({ referTo: emailVerificationCode.envelope.to[0], created });
};
