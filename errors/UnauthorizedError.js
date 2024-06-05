const { StatusCodes } = require("http-status-codes");
const ExtendedError = require("./ExtendedError");

module.exports = class UnauthorizedError extends ExtendedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
};
