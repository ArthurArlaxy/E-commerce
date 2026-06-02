import { HttpError } from "../Error/HttpError.js";
import { slugCreator, uniqueSlug } from "../helpers/slugFunctions.js";
import type { CategoryRepository } from "../Repository/CategoryRepository.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../Schema/CategorySchema.js";

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) { }

    async createCategory(data: CreateCategoryInput) {

        const baseSlug = slugCreator(data.slug ?? data.name);

        data.slug = await uniqueSlug(baseSlug, async (slug) => {
            return Boolean(await this.categoryRepository.getCategoryBySlug(slug))
        })

        return this.categoryRepository.createCategory(data)
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

async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await this.categoryRepository.getCategoryById(id)

    if (!category) throw new HttpError("Category not found", 404)

    const valueForSlug = data.slug ?? data.name;

    if (!valueForSlug) {
        throw new HttpError("Slug or name must be provided", 400)
    }

    const baseSlug = slugCreator(valueForSlug);

    data.slug = await uniqueSlug(baseSlug, async (slug) => {
        return Boolean(await this.categoryRepository.getCategoryBySlug(slug))
    })

    return this.categoryRepository.updateCategory(id, data)
}

    async deleteCategory(id: string) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)

        return await this.categoryRepository.deleteCategory(id)
    }
}