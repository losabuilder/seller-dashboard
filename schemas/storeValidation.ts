import * as z from "zod"

// Base schema for store fields used in both create and edit
export const storeFieldSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  email: z
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  logoContentHash: z.string().optional(),
})

// Schema for store creation with logoContentHash transformation
export const createStoreSchema = storeFieldSchema.transform((data) => ({
  ...data,
  logoContentHash: data.logoContentHash
    ? (data.logoContentHash as `0x${string}`)
    : null,
}))

// Schema for store updates (no transformation needed)
export const updateStoreSchema = storeFieldSchema

// Type exports for convenience
export type StoreFieldData = z.infer<typeof storeFieldSchema>
export type CreateStoreData = z.infer<typeof createStoreSchema>
export type UpdateStoreData = z.infer<typeof updateStoreSchema>
