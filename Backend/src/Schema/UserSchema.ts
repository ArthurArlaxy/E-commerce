import z from "zod";

const RoleEnum = z.enum(["admin", "client", "manager"]);

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: RoleEnum.default("client")
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const safeUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    role: RoleEnum,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type SafeUserReturn = z.infer<typeof safeUserSchema>;