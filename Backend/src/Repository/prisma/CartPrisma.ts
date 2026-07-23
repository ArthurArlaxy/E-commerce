import type { Cart, ProductCart } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { AddProductToCartInput } from "../../Schema/CartSchema.js";
import type { CartWithItems } from "../CartRepository.js";

export class CartPrisma {
    constructor() { }

    async getOrCreateCart(userId: string): Promise<Cart> {
        const cart = await prisma.cart.findUnique({ where: { userId } })

        if (cart) return cart

        return await prisma.cart.create({ data: { userId } })
    }

    async getCartByUserId(userId: string): Promise<CartWithItems | null> {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true
                            }
                        }
                    }
                }
            }
        })
    }

    async getCartItem(cartId: string, productId: string): Promise<ProductCart | null> {
        return await prisma.productCart.findUnique({
            where: {
                productId_cartId: { productId, cartId }
            }
        })
    }

    async addProductToCart(cartId: string, data: AddProductToCartInput): Promise<ProductCart> {
        return await prisma.productCart.create({
            data: {
                cartId,
                productId: data.productId,
                quantity: data.quantity
            }
        })
    }

    async updateCartItemQuantity(id: string, quantity: number): Promise<ProductCart> {
        return await prisma.productCart.update({
            where: { id },
            data: { quantity }
        })
    }

    async removeProductFromCart(id: string): Promise<ProductCart> {
        return await prisma.productCart.delete({ where: { id } })
    }

    async clearCart(cartId: string): Promise<void> {
        await prisma.productCart.deleteMany({ where: { cartId } })
    }
}