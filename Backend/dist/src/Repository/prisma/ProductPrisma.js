import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";
export class ProductPrisma {
    constructor() { }
    async createProduct(serviceData) {
        const data = toCreate(serviceData);
        return prisma.$transaction(async (transaction) => {
            const product = await transaction.product.create({
                data: {
                    name: data.name,
                    price: data.price,
                    slug: data.slug,
                    description: data.description,
                    stock: data.stock,
                    images: {
                        create: data.images.map(({ file: imageFile, ...imageFields }) => ({
                            ...imageFields,
                            file: { create: imageFile }
                        }))
                    }
                }
            });
            await transaction.productCategory.createMany({
                data: data.categoriesIds.map((categoryId) => ({
                    categoryId,
                    productId: product.id
                }))
            });
            return transaction.product.findUnique({
                where: { id: product.id },
                include: {
                    images: true,
                    productCategories: true
                }
            });
        });
    }
    async getProducts(filter, orderBy, order, take, skip) {
        const [items, total] = await prisma.$transaction([
            prisma.product.findMany({
                where: filter,
                orderBy: { [orderBy]: order },
                skip,
                take,
                include: {
                    images: {
                        where: { isCover: true },
                        take: 1
                    }
                }
            }),
            prisma.product.count({ where: filter })
        ]);
        return { items, total };
    }
    async getProductById(id) {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                productCategories: {
                    select: {
                        category: true
                    }
                }
            }
        });
    }
    async getProductBySlug(slug) {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                images: true,
                productCategories: {
                    select: {
                        category: true
                    },
                },
                reviews: {
                    select: {
                        user: {
                            select: {
                                name: true
                            }
                        },
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true
                    }
                }
            }
        });
        const totalReview = await prisma.review.count({
            where: { productId: product?.id }
        });
        if (!product) {
            return null;
        }
        return { product, totalReview };
    }
    async deleteProduct(id) {
        return await prisma.product.update({
            where: { id },
            data: { isActive: false, deletedAt: new Date() },
        });
    }
    async updateProduct(id, serviceData) {
        const data = toUpdate(serviceData);
        return prisma.$transaction(async (transaction) => {
            await transaction.product.update({
                where: { id },
                data: {
                    name: data.name,
                    price: data.price,
                    slug: data.slug,
                    stock: data.stock,
                    description: data.description,
                    isActive: data.isActive,
                }
            });
            if (data.images?.length) {
                await transaction.productImages.deleteMany({ where: { productId: id } });
                await transaction.product.update({
                    where: { id },
                    data: {
                        images: {
                            create: data.images.map(({ file: imageFile, ...imageFields }) => ({
                                ...imageFields,
                                file: { create: imageFile }
                            }))
                        }
                    }
                });
            }
            await transaction.productCategory.deleteMany({ where: { productId: id } });
            await transaction.productCategory.createMany({
                data: data.categoriesIds.map((categoryId) => ({
                    categoryId,
                    productId: id
                }))
            });
            return await transaction.product.findUnique({
                where: { id },
                include: {
                    images: true,
                    productCategories: true
                }
            });
        });
    }
    async addCategoriesToProduct(productId, categoryIds) {
        await prisma.productCategory.createMany({
            data: categoryIds.map((categoryId) => ({
                categoryId,
                productId
            }))
        });
    }
    async deleteCategoryFromProduct(productId, categoryId) {
        await prisma.productCategory.delete({
            where: {
                productId_categoryId: { productId, categoryId }
            }
        });
    }
    async addImagesToProduct(productId, data) {
        await prisma.productImages.createMany({
            data: data.map((image) => ({
                ...image,
                productId
            }))
        });
    }
    async deleteImageFromProduct(id) {
        return await prisma.productImages.delete({
            where: { id }
        });
    }
    async updateImagesFromProduct(updates) {
        await prisma.$transaction(updates.map(({ id, order, isCover }) => prisma.productImages.update({
            where: { id },
            data: { order, isCover }
        })));
    }
    async hardDeleteProduct(id) {
        return prisma.product.delete({ where: { id } });
    }
}
//# sourceMappingURL=ProductPrisma.js.map