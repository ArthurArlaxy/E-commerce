import { HttpError } from "../Error/HttpError.js";
import { slugCreator, uniqueSlug } from "../helpers/slugFunctions.js";
import type { CategoryRepository } from "../Repository/CategoryRepository.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../Schema/CategorySchema.js";
import fs from "node:fs"

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) { }

    async createCategory(data: CreateCategoryInput, files: Express.Multer.File[]) {

        const baseSlug = slugCreator(data.slug ?? data.name);

        data.slug = await uniqueSlug(baseSlug, async (slug) => {
            return Boolean(await this.categoryRepository.getCategoryBySlug(slug))
        })

        if (!files[0]) {
            throw new HttpError("Uma imagem precisa ser enviada para criar a categoria", 400)
        }

        const buffer = fs.readFileSync(files[0].path)
        fs.rmSync(files[0].path)
        const base64Image = buffer.toString("base64")
        const formData = new FormData()
        formData.append('image', base64Image)

        let imageUrl: string
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Erro no ImgBB: ${response.statusText}`)
            }

            const result = await response.json()

            imageUrl = result.data.image.url

        } catch (error) {
            console.error("Falha no ImgBB:", error, (error as any)?.cause)
            throw new HttpError("Falha ao enviar imagem para o ImgBB", 502)
        }

        data.imageUrl = imageUrl

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

    async updateCategory(id: string, data: UpdateCategoryInput, files: Express.Multer.File[]) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)


        if (data.name) {
            const valueForSlug = data.slug ?? data.name;

            if (!valueForSlug) {
                throw new HttpError("Slug or name must be provided", 400)
            }

            const baseSlug = slugCreator(valueForSlug);

            data.slug = await uniqueSlug(baseSlug, async (slug) => {
                let category = await this.categoryRepository.getCategoryBySlug(slug)
                if (!category || category.id === id) {
                    return false
                }
                return true
            })
        }

        if (!files?.[0]) {
            throw new HttpError("Uma imagem precisa ser enviada para atualizar a categoria", 400)
        }

        const buffer = fs.readFileSync(files[0].path)
        fs.rmSync(files[0].path)
        const base64Image = buffer.toString("base64")
        const formData = new FormData()
        formData.append('image', base64Image)

        let imageUrl: string
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Erro no ImgBB: ${response.statusText}`)
            }

            const result = await response.json()

            imageUrl = result.data.image.url

        } catch (error) {
            console.error("Falha no ImgBB:", error, (error as any)?.cause)
            throw new HttpError("Falha ao enviar imagem para o ImgBB", 502)
        }

        data.imageUrl = imageUrl

        return this.categoryRepository.updateCategory(id, data)
    }

    async deleteCategory(id: string) {
        const category = await this.categoryRepository.getCategoryById(id)

        if (!category) throw new HttpError("Category not found", 404)

        return await this.categoryRepository.deleteCategory(id)
    }
}