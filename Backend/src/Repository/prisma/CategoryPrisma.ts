import type { Category } from "@prisma/client";
import type { CreateCategoryInput, UpdateCategoryInput } from "../../Schema/CategorySchema.js";
import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";

export class CategoryPrisma {
    constructor() { }

    async createCategory(data: CreateCategoryInput): Promise<Category> {
        return await prisma.category.create({ data: toCreate(data) })
    }

    async getCategories(): Promise<Category[]> {
        return await prisma.category.findMany()
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return await prisma.category.findUnique({ where: { id } })
    }

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        return await prisma.category.findUnique({ where: { slug } })
    }

    async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
        return await prisma.category.update({
            where: { id },
            data: toUpdate(data)
        })
    }

    async deleteCategory(id: string): Promise<Category> {
        return await prisma.category.delete({ where: { id } })
    }
}