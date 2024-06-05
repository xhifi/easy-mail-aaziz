const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
const { AWS, mailServer } = require("../../config");

const ses = new aws.SES(AWS);

const transport = nodemailer.createTransport({
  SES: { ses, aws },
});

const mail = async ({ from = mailServer.from, to, subject, text, html, attachments, cc, bcc, replyTo = mailServer.replyTo, ...rest }) => {
  const mail = await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
    cc,
    bcc,
    replyTo,
    ...rest,
  });
  return mail;
};

const sendMail = async (...args) => {
  try {
    const verify = await transport.verify();

    if (verify) {
      return await mail(...args);
    }
    throw new Error("Error verifying transport");
  } catch (error) {
    return error;
  }
};

module.exports = sendMail;
