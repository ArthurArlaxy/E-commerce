import z from "zod";
export declare const createShippingSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.z.ZodCoercedNumber<unknown>;
    deliveryTime: z.z.ZodCoercedNumber<unknown>;
}, z.z.core.$strip>;
export declare const updateShippingSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    deliveryTime: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
}, z.z.core.$strip>;
export type CreateShippingSchema = z.infer<typeof createShippingSchema>;
export type UpdateShippingSchema = z.infer<typeof updateShippingSchema>;
//# sourceMappingURL=ShippingSchema.d.ts.map