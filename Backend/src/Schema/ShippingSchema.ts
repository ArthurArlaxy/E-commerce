import z from "zod";

export const createShippingSchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    deliveryTime: z.coerce.number()
})

export const updateShippingSchema = z.object({
    name: z.string().optional(),
    price: z.coerce.number().optional(),
    deliveryTime: z.coerce.number().optional()
})

export type CreateShippingSchema = z.infer<typeof createShippingSchema>
export type UpdateShippingSchema = z.infer<typeof updateShippingSchema>