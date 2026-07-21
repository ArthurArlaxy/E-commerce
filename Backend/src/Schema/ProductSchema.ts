import z from "zod"

export const createProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    slug: z.string().min(1).optional(),
    description: z.string().min(1),
    stock: z.number().int().min(0),
    categoryIds: z.array(z.string().uuid()).min(1),
    images: z.array(z.object({
        url: z.string(),
        order: z.number().int().min(0),
        isCover: z.boolean(),
    })).min(1),
})

export const imagesProductSchema = z.object({
    url: z.string(),
    order: z.number().int().min(0),
    isCover: z.boolean()
})

export const updateImagesProductSchema = z.object({
    id: z.string(),
    url: z.string(),
    order: z.number().int().min(0),
    isCover: z.boolean()
})

export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    description: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
})

export const productQuerySchema = z.object({
    name: z.string().optional(),
    maxPrice: z.number().optional(),
    minPrice: z.number().optional(),
    category: z.string().optional(),
    inStock: z.boolean().optional(),    // só produtos disponíveis
    orderBy: z.enum(["price", "name", "createdAt"]).optional().default("name"),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
})

export const idParamSchema = z.object({
    id: z.string().min(1),
})

export const slugParamSchema = z.object({
    slug: z.string().min(1),
})

export const productCategoryParamSchema = z.object({
    productId: z.string().min(1),
    categoryId: z.string().min(1),
})

export const addCategoriesToProductSchema = z.object({
    categoryIds: z.array(z.string().uuid()).min(1),
})

export const addImagesToProductSchema = z.array(imagesProductSchema).min(1)

export const updateImagesFromProductSchema = z.array(updateImagesProductSchema).min(1)

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQueryInput = z.infer<typeof productQuerySchema>
export type ImagesProductInput = z.infer<typeof imagesProductSchema>
export type UpdateImagesProductInput = z.infer<typeof updateImagesProductSchema>