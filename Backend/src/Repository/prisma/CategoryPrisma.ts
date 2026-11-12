import type { Category } from "@prisma/client";
import type { CategoryCreateData, CategoryUpdateData } from "../../Schema/CategorySchema.js";
import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";

export class CategoryPrisma {
    constructor() { }

    async createCategory(data: CategoryCreateData): Promise<Category> {
        const { file: imageFile, ...categoryData } = data

        return await prisma.category.create({
            data: {
                ...toCreate(categoryData),
                file: { create: imageFile }
            }
        })
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

    async updateCategory(id: string, data: CategoryUpdateData): Promise<Category> {
        const { file: imageFile, ...categoryData } = data

        const [, updatedCategory] = await prisma.$transaction([
            prisma.imageFile.deleteMany({ where: { categoryId: id } }),
            prisma.category.update({
                where: { id },
                data: {
                    ...toUpdate(categoryData),
                    file: { create: imageFile }
                }
            })
        ])

        return updatedCategory
    }

    async deleteCategory(id: string): Promise<Category> {
        return await prisma.category.delete({ where: { id } })
    }
}