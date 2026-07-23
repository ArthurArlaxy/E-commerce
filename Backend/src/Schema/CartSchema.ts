import z from "zod"

export const addProductToCartSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
})

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(1),
})

export const cartItemIdParamSchema = z.object({
    id: z.string().min(1),
})

export const updateCartItemSelectionSchema = z.object({
    selected: z.boolean(),
})

export type AddProductToCartInput = z.infer<typeof addProductToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>