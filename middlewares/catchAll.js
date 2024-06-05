const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

module.exports = (req, res) => {
  res.status(404).send("Route doesn't exist");
};
