import type { Prisma, Product, ProductCategory, ProductImages } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { CreateProductInput, ImagesProductInput, ProductQueryInput, UpdateImagesProductInput, UpdateProductInput } from "../../Schema/ProductSchema.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";

export class ProductPrisma {
    constructor() { }

    async createProduct(serviceData: CreateProductInput): Promise<Product | null> {
        const data = toCreate(serviceData)

        return prisma.$transaction(async (transaction) => {
            const product = await transaction.product.create({
                data: {
                    name: data.name,
                    price: data.price,
                    slug: data.slug,
                    description: data.description,
                    stock: data.stock
                }
            })

            await transaction.productImages.createMany({
                data: data.images.map((image: ImagesProductInput) => ({
                    url: image.url,
                    order: image.order,
                    isCover: image.isCover,
                    productId: product.id
                }))
            })

            await transaction.productCategory.createMany({
                data: data.categoryIds.map((categoryId: string) => ({
                    categoryId,
                    productId: product.id
                }))
            })

            return transaction.product.findUnique({
                where: { id: product.id },
                include: {
                    images: true,
                    productCategories: true
                }
            })
        })
    }

    async getProducts(filter: Prisma.ProductWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<Product[]> {
        return await prisma.product.findMany({
            where: filter,
            orderBy: { [orderBy]: order },
            skip,
            take
        })
    }

    async getProductsById(id: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id }
        })
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { slug }
        })
    }

    async deleteProduct(id: string): Promise<Product> {
        return await prisma.product.delete({ where: { id } })
    }

    async updateProduct(id: string, serviceData: UpdateProductInput): Promise<Product> {
        const data = toUpdate(serviceData)

        return await prisma.product.update({
            where: { id },
            data
        })
    }

    async addCategoriesToProduct(productId: string, categoryIds: string[]): Promise<void> {
        await prisma.productCategory.createMany({
            data: categoryIds.map((categoryId) => ({
                categoryId,
                productId
            }))
        })
    }

    async deleteCategoryFromProduct(productId: string, categoryId: string): Promise<void> {
        await prisma.productCategory.delete({
            where: {
                productId_categoryId: { productId, categoryId }
            }
        })
    }

    async addImagesToProduct(productId: string, data: ImagesProductInput[]): Promise<void> {
        await prisma.productImages.createMany({
            data: data.map((image) => ({
                ...image,
                productId
            }))
        })
    }

    async deleteImageFromProduct(id: string): Promise<ProductImages>{
        return await prisma.productImages.delete({
            where: { id }
        })
    }

    async updateImagesFromProduct(updates: UpdateImagesProductInput[]): Promise<void> {
        await prisma.$transaction(
            updates.map(({ id, order, isCover }) =>
                prisma.productImages.update({
                    where: { id },
                    data: { order, isCover }
                })
            )
        )
    }
}