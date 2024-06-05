const { StatusCodes } = require("http-status-codes");
const ExtendedError = require("./ExtendedError");

module.exports = class NotFoundError extends ExtendedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
};
