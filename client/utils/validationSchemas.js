import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

module.exports = { bookSchema };
