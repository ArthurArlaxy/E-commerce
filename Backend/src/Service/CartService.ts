import { Decimal } from "decimal.js";
import { HttpError } from "../Error/HttpError.js";
import type { CartRepository } from "../Repository/CartRepository.js";
import type { ProductRepository } from "../Repository/ProductRepository.js";
import type { AddProductToCartInput, UpdateCartItemInput } from "../Schema/CartSchema.js";

export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private productRepository: ProductRepository
    ) { }

    async getCart(userId: string) {
        const cart = await this.cartRepository.getCartByUserId(userId)

        if (!cart) {
            return { id: null, items: [], total: "0.00" }
        }

        const items = cart.products.map((item) => {
            const price = new Decimal(item.product.price)
            const subtotal = price.times(item.quantity)

            return {
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                price: price.toFixed(2),
                quantity: item.quantity,
                subtotal: subtotal.toFixed(2)
            }
        })

        const total = items.reduce(
            (acc, item) => acc.plus(item.subtotal),
            new Decimal(0)
        )

        return { id: cart.id, items, total: total.toFixed(2) }
    }
    
    async addProductToCart(userId: string, data: AddProductToCartInput) {
        const product = await this.productRepository.getProductById(data.productId)

        if (!product) {
            throw new HttpError("Product not found", 404)
        }

        if (product.stock < data.quantity) {
            throw new HttpError("Insufficient stock", 400)
        }

        const cart = await this.cartRepository.getOrCreateCart(userId)

        const existingItem = await this.cartRepository.getCartItem(cart.id, data.productId)

        if (existingItem) {
            const newQuantity = existingItem.quantity + data.quantity

            if (product.stock < newQuantity) {
                throw new HttpError("Insufficient stock", 400)
            }

            return await this.cartRepository.updateCartItemQuantity(existingItem.id, newQuantity)
        }

        return await this.cartRepository.addProductToCart(cart.id, data)
    }

    async updateCartItem(userId: string, itemId: string, data: UpdateCartItemInput) {
        const cart = await this.cartRepository.getCartByUserId(userId)

        if (!cart) {
            throw new HttpError("Cart not found", 404)
        }

        const item = cart.products.find((product) => product.id === itemId)

        if (!item) {
            throw new HttpError("Item not found in your cart", 404)
        }

        if (item.product.stock < data.quantity) {
            throw new HttpError("Insufficient stock", 400)
        }

        return await this.cartRepository.updateCartItemQuantity(itemId, data.quantity)
    }

    async removeProductFromCart(userId: string, itemId: string) {
        const cart = await this.cartRepository.getCartByUserId(userId)

        if (!cart) {
            throw new HttpError("Cart not found", 404)
        }

        const item = cart.products.find((product) => product.id === itemId)

        if (!item) {
            throw new HttpError("Item not found in your cart", 404)
        }

        return await this.cartRepository.removeProductFromCart(itemId)
    }

    async clearCart(userId: string) {
        const cart = await this.cartRepository.getCartByUserId(userId)

        if (!cart) {
            throw new HttpError("Cart not found", 404)
        }

        await this.cartRepository.clearCart(cart.id)
    }
}