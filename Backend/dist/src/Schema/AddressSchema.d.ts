import z from "zod";
export declare const createAddressSchema: z.ZodObject<{
    street: z.ZodString;
    number: z.ZodOptional<z.ZodString>;
    complement: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    isPrimary: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    userId: z.ZodString;
}, z.z.core.$strip>;
export declare const updateAddressSchema: z.ZodObject<{
    street: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodString>;
    complement: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodString>;
    isPrimary: z.ZodOptional<z.ZodBoolean>;
    userId: z.ZodString;
}, z.z.core.$strip>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
//# sourceMappingURL=AddressSchema.d.ts.map