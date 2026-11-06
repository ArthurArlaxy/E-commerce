import { Prisma } from "@prisma/client";
import { HttpError } from "../Error/HttpError.js";
import type { ProductRepository } from "../Repository/ProductRepository.js";
import type { CreateProductInput, ImagesProductInput, ProductCreateData, ProductQueryInput, UpdateImagesProductInput, UpdateProductInput } from "../Schema/ProductSchema.js";

import { slugCreator, uniqueSlug } from "../helpers/slugFunctions.js";
import { processImage } from "../helpers/processImage.js";

export class ProductService {
    constructor(private productRepository: ProductRepository) { }

    private async buildImages(files: Express.Multer.File[] | undefined, coverIndex?: number) {
        const processedImages = await Promise.all(
            (files ?? []).map((file) => processImage(file.buffer))
        )

        return processedImages.map(({ url, ...imageFile }, order) => ({
            url,
            order,
            isCover: order === coverIndex,
            file: imageFile
        }))
    }


    async createProduct(data: CreateProductInput, files: Express.Multer.File[]) {
        const baseSlug = slugCreator(data.slug ?? data.name)

        const slug = await uniqueSlug(baseSlug, async (candidateSlug) => {
            return Boolean(await this.productRepository.getProductBySlug(candidateSlug))
        })

        const images = await this.buildImages(files, data.coverIndex)

        const product = await this.productRepository.createProduct({ ...data, slug, images })

        if (!product) {
            throw new HttpError("Erro ao criar o produto", 500)
        }

        return product
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

        if (query.categories) {

            filter.productCategories = {
                some: {
                    categoryId: {
                        in: query.categories
                    }
                }
            };
        }

        if (query.includeOutOfStock === false) {
            filter.stock = {
                gt: 0
            }
        }

        if (query.isActive) {
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

    async updateProduct(id: string, data: UpdateProductInput, files: Express.Multer.File[]) {

        if (typeof id !== "string") {
            throw new HttpError("Invalid Product ID", 400)
        }

        await this.getProductById(id)

        if (data.slug || data.name) {
            const baseSlug = slugCreator(data.slug || data.name)
            data.slug = await uniqueSlug(baseSlug, async (slug: string) => {
                let product = await this.productRepository.getProductBySlug(slug)
                if (!product || product.product.id === id) {
                    return false
                }
                return true
            })
        }

        const newImages = files?.length > 0
            ? await this.buildImages(files, data.coverIndex)
            : undefined

        const updatedProduct = await this.productRepository.updateProduct(id, { ...data, images: newImages })

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