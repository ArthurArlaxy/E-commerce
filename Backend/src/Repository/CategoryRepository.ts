import type { Category } from "@prisma/client";
import type { CreateCategoryInput, UpdateCategoryInput } from "../Schema/CategorySchema.js";


export interface CategoryRepository{
    createCategory(data: CreateCategoryInput): Promise<Category>
    getCategories(): Promise<Category[]>
    getCategoryById(id: string): Promise<Category | null>
    getCategoryBySlug(slug:string): Promise<Category | null>
    updateCategory(id: string, data: UpdateCategoryInput): Promise<Category>
    deleteCategory(id: string): Promise<Category>
}