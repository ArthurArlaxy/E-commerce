import z from "zod";
export declare const addProductToCartSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodDefault<z.ZodOptional<z.z.ZodCoercedNumber<unknown>>>;
}, z.z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, z.z.core.$strip>;
export declare const cartItemIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.z.core.$strip>;
export declare const updateCartItemSelectionSchema: z.ZodObject<{
    selected: z.ZodBoolean;
}, z.z.core.$strip>;
export type AddProductToCartInput = z.infer<typeof addProductToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
//# sourceMappingURL=CartSchema.d.ts.map