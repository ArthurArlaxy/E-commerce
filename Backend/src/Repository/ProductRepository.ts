import type { Prisma, Product, ProductImages } from "@prisma/client";
import type { CreateProductInput, ImagesProductInput, UpdateImagesProductInput, UpdateProductInput } from "../Schema/ProductSchema.js";

export interface ProductRepository {
    createProduct(data: CreateProductInput): Promise<Product>
    getProducts(filter: Prisma.ProductWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<Product[]>
    getProductById(id: string): Promise<Product | null>
    getProductBySlug(slug: string): Promise<Product | null>
    deleteProduct(id: string): Promise<Product>
    updateProduct(id: string, data: UpdateProductInput): Promise<Product>
    addCategoriesToProduct(productId: string, categoryIds: string[]): Promise<void>
    deleteCategoryFromProduct(productId: string, categoryId: string): Promise<void>
    addImagesToProduct(productId: string, data: ImagesProductInput[]): Promise<void>
    deleteImageFromProduct(id: string): Promise<ProductImages>
    updateImagesFromProduct(updates: UpdateImagesProductInput[]): Promise<void>
}