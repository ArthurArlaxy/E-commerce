import z from "zod";
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.z.ZodCoercedNumber<unknown>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    stock: z.z.ZodCoercedNumber<unknown>;
    categoriesIds: z.ZodPreprocess<z.ZodArray<z.ZodString>>;
    coverIndex: z.z.ZodCoercedNumber<unknown>;
}, z.z.core.$strip>;
export declare const productImageCreateData: z.ZodObject<{
    url: z.ZodString;
    isCover: z.ZodBoolean;
    order: z.ZodNumber;
    file: z.ZodObject<{
        id: z.ZodString;
        data: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export declare const productCreateData: z.ZodObject<{
    name: z.ZodString;
    price: z.z.ZodCoercedNumber<unknown>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    stock: z.z.ZodCoercedNumber<unknown>;
    categoriesIds: z.ZodArray<z.ZodString>;
    coverIndex: z.ZodNumber;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        isCover: z.ZodBoolean;
        order: z.ZodNumber;
        file: z.ZodObject<{
            id: z.ZodString;
            data: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export declare const getProduct: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    slug: z.ZodString;
    description: z.ZodString;
    stock: z.ZodNumber;
    id: z.ZodString;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    deletedAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodDate;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        isCover: z.ZodBoolean;
        order: z.ZodNumber;
        id: z.ZodString;
        productId: z.ZodString;
    }, z.z.core.$strip>>;
    productCategories: z.ZodArray<z.ZodObject<{
        category: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            slug: z.ZodString;
            createdAt: z.ZodDate;
            updatedAt: z.ZodDate;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export declare const imagesProductSchema: z.ZodObject<{
    url: z.ZodString;
    order: z.ZodNumber;
    isCover: z.ZodBoolean;
}, z.z.core.$strip>;
export declare const updateImagesProductSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    order: z.ZodNumber;
    isCover: z.ZodBoolean;
}, z.z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    stock: z.z.ZodCoercedNumber<unknown>;
    categoriesIds: z.ZodPreprocess<z.ZodArray<z.ZodString>>;
    coverIndex: z.z.ZodCoercedNumber<unknown>;
}, z.z.core.$strip>;
export declare const productUpdateData: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    stock: z.z.ZodCoercedNumber<unknown>;
    coverIndex: z.ZodNumber;
    categoriesIds: z.ZodArray<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        isCover: z.ZodBoolean;
        order: z.ZodNumber;
        file: z.ZodObject<{
            id: z.ZodString;
            data: z.ZodCustom<Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>>>;
}, z.z.core.$strip>;
export declare const productQuerySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    maxPrice: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    minPrice: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    categories: z.ZodPreprocess<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    includeOutOfStock: z.ZodPreprocess<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    isActive: z.ZodPreprocess<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    orderBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        name: "name";
        createdAt: "createdAt";
        price: "price";
    }>>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    page: z.ZodOptional<z.z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodOptional<z.z.ZodCoercedNumber<unknown>>>;
}, z.z.core.$strip>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.z.core.$strip>;
export declare const slugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.z.core.$strip>;
export declare const productCategoryParamSchema: z.ZodObject<{
    productId: z.ZodString;
    categoryId: z.ZodString;
}, z.z.core.$strip>;
export declare const addCategoriesToProductSchema: z.ZodObject<{
    categoryIds: z.ZodArray<z.ZodString>;
}, z.z.core.$strip>;
export declare const addImagesToProductSchema: z.ZodArray<z.ZodObject<{
    url: z.ZodString;
    order: z.ZodNumber;
    isCover: z.ZodBoolean;
}, z.z.core.$strip>>;
export declare const updateImagesFromProductSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    order: z.ZodNumber;
    isCover: z.ZodBoolean;
}, z.z.core.$strip>>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type ImagesProductInput = z.infer<typeof imagesProductSchema>;
export type UpdateImagesProductInput = z.infer<typeof updateImagesProductSchema>;
export type ProductCreateData = z.infer<typeof productCreateData>;
export type ProductImageCreateData = z.infer<typeof productImageCreateData>;
export type ProductUpdateData = z.infer<typeof productUpdateData>;
export type GetProductSchema = z.infer<typeof getProduct>;
//# sourceMappingURL=ProductSchema.d.ts.map