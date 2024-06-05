const { StatusCodes } = require("http-status-codes");
const ExtendedError = require("./ExtendedError");

module.exports = class ForbiddenActionError extends ExtendedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
};
