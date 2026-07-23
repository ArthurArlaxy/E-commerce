import type { Cart, Prisma, ProductCart } from "@prisma/client";
import type { AddProductToCartInput } from "../Schema/CartSchema.js";

export type CartWithItems = Cart & {
    products: (ProductCart & {
        product: {
            id: string
            name: string
            price: Prisma.Decimal
            stock: number
        }
    })[]
}

export interface CartRepository {
    getOrCreateCart(userId: string): Promise<Cart>
    getCartByUserId(userId: string): Promise<CartWithItems | null>
    getCartItem(cartId: string, productId: string): Promise<ProductCart | null>
    addProductToCart(cartId: string, data: AddProductToCartInput): Promise<ProductCart>
    updateCartItemQuantity(id: string, quantity: number): Promise<ProductCart>
    removeProductFromCart(id: string): Promise<ProductCart>
    clearCart(cartId: string): Promise<void>
}