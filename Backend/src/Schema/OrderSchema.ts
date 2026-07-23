import z from "zod"

const statusSchema = z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
])

export const createOrderSchema = z.object({
    addressId: z.string().min(1),
})

export const updateOrderStatusSchema = z.object({
    status: statusSchema,
})

export const orderQuerySchema = z.object({
    status: statusSchema.optional(),
    orderBy: z.enum(["createdAt", "total"]).optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
})

export const idParamSchema = z.object({
    id: z.string().min(1),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderQueryInput = z.infer<typeof orderQuerySchema>

