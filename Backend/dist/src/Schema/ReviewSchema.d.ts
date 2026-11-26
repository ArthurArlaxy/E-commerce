import z from "zod";
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
}, z.z.core.$strip>;
export declare const updateReviewSchema: z.ZodObject<{
    rating: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const reviewQuerySchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    orderBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        rating: "rating";
    }>>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    page: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
}, z.z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.z.core.$strip>;
export declare const productIdParamSchema: z.ZodObject<{
    productId: z.ZodString;
}, z.z.core.$strip>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
//# sourceMappingURL=ReviewSchema.d.ts.map