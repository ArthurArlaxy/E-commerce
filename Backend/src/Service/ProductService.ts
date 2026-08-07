import { Prisma } from "@prisma/client";
import { HttpError } from "../Error/HttpError.js";
import { slugCreator, uniqueSlug } from "../helpers/slugFunctions.js";
import type { ProductRepository } from "../Repository/ProductRepository.js";
import type { CreateProductInput, ImagesProductInput, ProductCreateData, ProductQueryInput, UpdateImagesProductInput, UpdateProductInput } from "../Schema/ProductSchema.js";
import fs from "fs"

export class ProductService {
    constructor(private productRepository: ProductRepository) { }

    async createProduct(data: CreateProductInput, files: Express.Multer.File[]) {
        const baseSlug = slugCreator(data.slug ?? data.name)

        data.slug = await uniqueSlug(baseSlug, async (slug) => {
            return Boolean(await this.productRepository.getProductBySlug(slug))
        })

        const uploadedImages: { url: string, order: number, isCover: boolean }[] = []
        let orderImage: number = 0

        for (const image of files) {
            const buffer = fs.readFileSync(image.path)
            fs.rmSync(image.path)
            const base64Image = buffer.toString("base64")
            const formData = new FormData()
            formData.append('image', base64Image)
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMGBB_KEY}`, {
                    method: "POST",
                    body: formData
                })

                if (!response.ok) {
                    throw new Error(`Erro no ImgBB: ${response.statusText}`)
                }

                const result = await response.json()
                
                const url = result.data.url
                const order  = orderImage
                const isCover =  orderImage === data.coverIndex ? true : false 
                orderImage++

                uploadedImages.push({ url, order, isCover })

            } catch (error) {
                return new HttpError(`${error}`, 400)
            }
        }


        const serviceData: ProductCreateData = {
            ...data,
            images: [...uploadedImages]
        }

        return this.productRepository.createProduct(serviceData)
    }

    async getProducts(query: ProductQueryInput) {
        const filter: Prisma.ProductWhereInput = {}

        if (query.name) {
            filter.name = {
                contains: query.name,
                mode: "insensitive"
            }
        }

        if (query.maxPrice || query.minPrice) {
            filter.price = {
                lte: query.maxPrice ?? undefined,
                gte: query.minPrice ?? undefined
            }
        }

        if (query.category) {
            filter.productCategories = {
                some: {
                    categoryId: query.category
                }
            }
        }

        if (query.inStock) {
            filter.stock = {
                gt: 0
            }
        }

        if(query.isActive){
            filter.isActive = query.isActive
        }

        const take = query.limit ?? 20
        const skip = query.page ? (query.page - 1) * take : 0

        return await this.productRepository.getProducts(filter, query.orderBy ?? "name", query.order ?? "asc", take, skip)
    }

    async getProductById(id: string) {
        if (typeof id != "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        const product = await this.productRepository.getProductById(id)

        if (!product) {
            throw new HttpError("Product not found", 400)
        }

        return product
    }

    async getProductBySlug(slug: string) {
        if (typeof slug != "string") {
            throw new HttpError("Invalid Product slug", 400)
        }

        const product = await this.productRepository.getProductBySlug(slug)

        if (!product) {
            throw new HttpError("Product not found", 400)
        }

        return product
    }
    async updateProduct(id: string, data: UpdateProductInput) {
        if (typeof id !== "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        const productExists = await this.getProductById(id)

        if (!productExists) {
            throw new HttpError("Product not found", 404)
        }

        const updatedProduct = await this.productRepository.updateProduct(id, data)

        if (!updatedProduct) {
            throw new HttpError("Error occurred while updating the product", 500)
        }

        return updatedProduct
    }

    async deleteProduct(id: string) {
        if (typeof id !== "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        const productExists = await this.getProductById(id)

        if (!productExists) {
            throw new HttpError("Product not found", 404)
        }

        const deletedProduct = await this.productRepository.deleteProduct(id)

        if (!deletedProduct) {
            throw new HttpError("Error occurred while deleting the product", 500)
        }

        return deletedProduct
    }

    async addCategoriesToProduct(productId: string, categoryIds: string[]) {
        if (typeof productId != "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        if (
            !Array.isArray(categoryIds) ||
            categoryIds.length === 0 ||
            !categoryIds.every(tag => typeof tag === "string" && tag.trim() !== "")
        ) {
            throw new HttpError("Tags must be a non-empty array of non-empty strings", 400)
        }

        return await this.productRepository.addCategoriesToProduct(productId, categoryIds)
    }

    async deleteCategoryFromProduct(productId: string, categoryId: string) {
        if (typeof productId != "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        if (typeof categoryId != "string") {
            throw new HttpError("Invalid Category ID", 400)
        }

        return await this.productRepository.deleteCategoryFromProduct(productId, categoryId)
    }

    async addImagesToProduct(productId: string, data: ImagesProductInput[]) {
        if (typeof productId != "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        if (
            !Array.isArray(data) ||
            data.length === 0 ||
            !data.every(image => typeof image.url === "string" && typeof image.order === "number" && typeof image.isCover === "boolean")
        ) {
            throw new HttpError("Images must be a non-empty array of non-empty datas", 400)
        }

        return await this.productRepository.addImagesToProduct(productId, data)
    }

    async deleteImagesFromProduct(id: string) {
        if (typeof id != "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        return await this.productRepository.deleteImageFromProduct(id)
    }

    async updateImagesFromProduct(data: UpdateImagesProductInput[]) {
        if (
            !Array.isArray(data) ||
            data.length === 0 ||
            !data.every(image => typeof image.order === "number" && typeof image.isCover === "boolean" && typeof image.id === "string")
        ) {
            throw new HttpError("Images must be a non-empty array of non-empty datas", 400)
        }

        return await this.productRepository.updateImagesFromProduct(data)
    }
}