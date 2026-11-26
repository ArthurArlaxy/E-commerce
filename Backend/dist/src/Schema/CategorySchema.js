import z from "zod";
export const createCategorySchema = z.object({
    name: z.string(),
    slug: z.string().optional()
});
export const updateCategorySchema = z.object({
    name: z.string().optional(),
    slug: z.string().optional()
});
//# sourceMappingURL=CategorySchema.js.map