import z from "zod";
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        admin: "admin";
        client: "client";
        manager: "manager";
    }>>;
}, z.z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    currentPassword: z.ZodOptional<z.ZodString>;
    newPassword: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const safeUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        client: "client";
        manager: "manager";
    }>;
}, z.z.core.$strip>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type SafeUserReturn = z.infer<typeof safeUserSchema>;
//# sourceMappingURL=UserSchema.d.ts.map