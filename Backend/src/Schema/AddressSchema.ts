import z from "zod";

export const createAddressSchema = z.object({
    street: z.string(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    isPrimary: z.boolean().default(false),
    userId: z.string()
})

export const updateAddressSchema = z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    isPrimary: z.boolean().optional(),
    userId: z.string()
})

export type CreateAddressInput = z.infer<typeof createAddressSchema>
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>