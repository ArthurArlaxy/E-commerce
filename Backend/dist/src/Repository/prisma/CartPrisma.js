import { prisma } from "../../Database/index.js";
export class CartPrisma {
    constructor() { }
    async getOrCreateCart(userId) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                products: {
                    orderBy: { product: { name: "desc" } },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true,
                                slug: true,
                                deletedAt: true,
                                isActive: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                },
                                productCategories: {
                                    select: {
                                        category: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (cart)
            return cart;
        return await prisma.cart.create({ data: { userId } });
    }
    async getCartByUserId(userId) {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                products: {
                    orderBy: { product: { name: "desc" } },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true,
                                slug: true,
                                isActive: true,
                                deletedAt: true,
                                images: {
                                    select: {
                                        isCover: true,
                                        url: true
                                    }
                                },
                                productCategories: {
                                    select: {
                                        category: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async getCartItem(cartId, productId) {
        return await prisma.productCart.findUnique({
            where: {
                productId_cartId: { productId, cartId }
            }
        });
    }
    async addProductToCart(cartId, data) {
        return await prisma.productCart.create({
            data: {
                cartId,
                productId: data.productId,
                quantity: data.quantity
            }
        });
    }
    async updateCartItemQuantity(id, quantity) {
        return await prisma.productCart.update({
            where: { id },
            data: { quantity }
        });
    }
    async updateCartItemSelection(id, selected) {
        return await prisma.productCart.update({
            where: { id },
            data: { selected }
        });
    }
    async updateManyCartItemSelection(ids, selected) {
        await prisma.productCart.updateMany({
            where: { id: { in: ids } },
            data: { selected }
        });
    }
    async removeProductFromCart(id) {
        return await prisma.productCart.delete({ where: { id } });
    }
    async removeItems(purchasedCartItemIds) {
        await prisma.productCart.deleteMany({
            where: { id: { in: purchasedCartItemIds } }
        });
    }
    async clearCart(cartId) {
        await prisma.productCart.deleteMany({ where: { cartId } });
    }
}
//# sourceMappingURL=CartPrisma.js.map