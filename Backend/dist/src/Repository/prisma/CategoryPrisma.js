import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";
export class CategoryPrisma {
    constructor() { }
    async createCategory(data) {
        const { file: imageFile, ...categoryData } = data;
        return await prisma.category.create({
            data: {
                ...toCreate(categoryData),
                file: { create: imageFile }
            }
        });
    }
    async getCategories() {
        return await prisma.category.findMany();
    }
    async getCategoryById(id) {
        return await prisma.category.findUnique({ where: { id } });
    }
    async getCategoryBySlug(slug) {
        return await prisma.category.findUnique({ where: { slug } });
    }
    async updateCategory(id, data) {
        const { file: imageFile, ...categoryData } = data;
        const [, updatedCategory] = await prisma.$transaction([
            prisma.imageFile.deleteMany({ where: { categoryId: id } }),
            prisma.category.update({
                where: { id },
                data: {
                    ...toUpdate(categoryData),
                    file: { create: imageFile }
                }
            })
        ]);
        return updatedCategory;
    }
    async deleteCategory(id) {
        return await prisma.category.delete({ where: { id } });
    }
}
//# sourceMappingURL=CategoryPrisma.js.map