import type { CategoryRepository } from "../Repository/CategoryRepository.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../Schema/CategorySchema.js";
export declare class CategoryService {
    private categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    createCategory(data: CreateCategoryInput, files: Express.Multer.File[]): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }>;
    getCategoryBySlug(slug: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }>;
    updateCategory(id: string, data: UpdateCategoryInput, files: Express.Multer.File[]): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        imageUrl: string | null;
    }>;
}
//# sourceMappingURL=CategoryService.d.ts.map