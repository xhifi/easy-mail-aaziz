const { z } = require("zod");

module.exports = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be longer than 3 characters" })
    .max(255, { message: "Name must be less than 255 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be between 6 and 255 characters" })
    .max(255, { message: "Password must be between 6 and 255 characters" }),
});
