import { HttpError } from "../Error/HttpError.js";
import { processImage } from "../helpers/processImage.js";
import { slugCreator, uniqueSlug } from "../helpers/slugFunctions.js";
import type { CategoryRepository } from "../Repository/CategoryRepository.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../Schema/CategorySchema.js";

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) { }

    async createCategory(data: CreateCategoryInput, files: Express.Multer.File[]) {
        if (!files?.[0]) {
            throw new HttpError("Uma imagem precisa ser enviada para criar a categoria", 400)
        }

        const baseSlug = slugCreator(data.slug ?? data.name)

        const slug = await uniqueSlug(baseSlug, async (candidateSlug) => {
            return Boolean(await this.categoryRepository.getCategoryBySlug(candidateSlug))
        })

        const { url: imageUrl, ...imageFile } = await processImage(files[0].buffer)

        return this.categoryRepository.createCategory({
            ...data,
            slug,
            imageUrl,
            file: imageFile
        })
    }

    async getCategories() {
        return await this.categoryRepository.getCategories()
    }

    async getCategoryById(id: string) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)

        return category
    }

    async getCategoryBySlug(slug: string) {
        const category = await this.categoryRepository.getCategoryBySlug(slug)

        if (!category) throw new HttpError("Category not found", 404)

        return category
    }

    async updateCategory(id: string, data: UpdateCategoryInput, files: Express.Multer.File[]) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)

        if (!files?.[0]) {
            throw new HttpError("Uma imagem precisa ser enviada para atualizar a categoria", 400)
        }

        let slug = data.slug

        if (data.name) {
            const valueForSlug = data.slug ?? data.name

            if (!valueForSlug) {
                throw new HttpError("Slug or name must be provided", 400)
            }

            const baseSlug = slugCreator(valueForSlug)

            slug = await uniqueSlug(baseSlug, async (candidateSlug) => {
                const categoryWithSameSlug = await this.categoryRepository.getCategoryBySlug(candidateSlug)
                return Boolean(categoryWithSameSlug && categoryWithSameSlug.id !== id)
            })
        }

        const { url: imageUrl, ...imageFile } = await processImage(files[0].buffer)

        return this.categoryRepository.updateCategory(id, {
            ...data,
            slug,
            imageUrl,
            file: imageFile
        })
    }

    async deleteCategory(id: string) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)

        return await this.categoryRepository.deleteCategory(id)
    }
}