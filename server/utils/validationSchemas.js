const { z } = require("zod");

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  available: z.boolean().optional(),
  rentPrice: z.number().positive("Rent price must be a positive number"),
});

const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  location: z.string().min(1, "location is required"),
  role: z.enum(
    ["admin", "owner", "user"],
    "Role must be either 'admin', 'owner', or 'user'"
  ),
});

const loginUserSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const approveUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  approveUserSchema,
  bookSchema,
};
