import z from "zod"

export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1),
})

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
})

export const reviewQuerySchema = z.object({
    productId: z.string().optional(),
    userId: z.string().optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    orderBy: z.enum(["rating", "createdAt"]).optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
})

export const idParamSchema = z.object({
    id: z.string().min(1),
})

export const productIdParamSchema = z.object({
    productId: z.string().min(1),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>