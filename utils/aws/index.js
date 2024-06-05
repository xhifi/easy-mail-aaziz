const awsClient = require("@aws-sdk/client-ses");
const { awsConfig } = require("../../config");

const ses = new awsClient.SES(awsConfig);

module.exports = { ses, awsClient };
