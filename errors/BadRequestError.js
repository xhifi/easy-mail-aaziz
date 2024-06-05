const { StatusCodes } = require("http-status-codes");
const ExtendedError = require("./ExtendedError");

module.exports = class BadRequest extends ExtendedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
};
