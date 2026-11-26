import z from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryImageFileData = {
    id: string;
    data: Buffer;
};
export type CategoryCreateData = CreateCategoryInput & {
    imageUrl: string;
    file: CategoryImageFileData;
};
export type CategoryUpdateData = UpdateCategoryInput & {
    imageUrl: string;
    file: CategoryImageFileData;
};
//# sourceMappingURL=CategorySchema.d.ts.map