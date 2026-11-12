import type { Category } from "@prisma/client";
import type { CategoryCreateData, CategoryUpdateData } from "../Schema/CategorySchema.js";

export interface CategoryRepository {
    createCategory(data: CategoryCreateData): Promise<Category>
    getCategories(): Promise<Category[]>
    getCategoryById(id: string): Promise<Category | null>
    getCategoryBySlug(slug: string): Promise<Category | null>
    updateCategory(id: string, data: CategoryUpdateData): Promise<Category>
    deleteCategory(id: string): Promise<Category>
}