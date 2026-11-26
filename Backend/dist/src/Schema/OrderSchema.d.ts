import z from "zod";
export interface DateLimit {
    gte: Date;
    lt: Date;
}
export declare const createOrderSchema: z.ZodObject<{
    addressId: z.ZodString;
    shippingId: z.ZodString;
}, z.z.core.$strip>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        paid: "paid";
        processing: "processing";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
    }>;
}, z.z.core.$strip>;
export declare const orderQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        paid: "paid";
        processing: "processing";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
    }>>;
    orderBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        total: "total";
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
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
//# sourceMappingURL=OrderSchema.d.ts.map