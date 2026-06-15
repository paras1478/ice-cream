import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
