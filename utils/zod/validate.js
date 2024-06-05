const { BadRequestError } = require("../../errors");

module.exports = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.error) {
    const message = result.error.errors.map((error) => `${error.path[0]} ${error.message}`).join(", ");
    throw new BadRequestError(message);
  }
};
