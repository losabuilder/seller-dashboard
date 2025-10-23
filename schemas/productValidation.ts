import * as z from "zod"

// Base schema for product fields
export const productFieldSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be a positive number"),
  inventory: z.number().min(0, "Inventory must be a non-negative number"),
  sku: z.string().optional(),
  upc: z.string().optional(),
  return_window: z.string().min(1, "Return window is required"),
  return_policy: z.string().min(1, "Return policy is required"),
  shipping: z.string().min(1, "Shipping policy is required"),
})

// Schema for product creation
export const createProductSchema = productFieldSchema

// Schema for product updates
export const updateProductSchema = productFieldSchema.partial()

// Type exports for convenience
export type ProductFieldData = z.infer<typeof productFieldSchema>
export type CreateProductData = z.infer<typeof createProductSchema>
export type UpdateProductData = z.infer<typeof updateProductSchema>
