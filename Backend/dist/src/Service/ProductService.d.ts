import { Prisma } from "@prisma/client";
import type { ProductRepository } from "../Repository/ProductRepository.js";
import type { CreateProductInput, ImagesProductInput, ProductQueryInput, UpdateImagesProductInput, UpdateProductInput } from "../Schema/ProductSchema.js";
export declare class ProductService {
    private productRepository;
    constructor(productRepository: ProductRepository);
    private buildImages;
    createProduct(data: CreateProductInput, files: Express.Multer.File[]): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        description: string;
        deletedAt: Date | null;
        isActive: boolean;
    }>;
    getProducts(query: ProductQueryInput): Promise<{
        items: import(".prisma/client").Product[];
        total: number;
    }>;
    getProductById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        description: string;
        deletedAt: Date | null;
        isActive: boolean;
    }>;
    getProductBySlug(slug: string): Promise<{
        product: import(".prisma/client").Product;
        totalReview: number;
    }>;
    updateProduct(id: string, data: UpdateProductInput, files: Express.Multer.File[]): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        description: string;
        deletedAt: Date | null;
        isActive: boolean;
    }>;
    deleteProduct(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        price: Prisma.Decimal;
        stock: number;
        description: string;
        deletedAt: Date | null;
        isActive: boolean;
    }>;
    addCategoriesToProduct(productId: string, categoryIds: string[]): Promise<void>;
    deleteCategoryFromProduct(productId: string, categoryId: string): Promise<void>;
    addImagesToProduct(productId: string, data: ImagesProductInput[]): Promise<void>;
    deleteImagesFromProduct(id: string): Promise<{
        id: string;
        url: string;
        isCover: boolean;
        order: number;
        productId: string;
    }>;
    updateImagesFromProduct(data: UpdateImagesProductInput[]): Promise<void>;
}
//# sourceMappingURL=ProductService.d.ts.map