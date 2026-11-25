import { Decimal } from "decimal.js";
import { HttpError } from "../Error/HttpError.js";
export class CartService {
    cartRepository;
    productRepository;
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async getCart(userId) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            return { id: null, items: [], total: "0.00", selectedTotal: "0.00" };
        }
        const idsToDeselect = [];
        const items = cart.products.map((item) => {
            const price = new Decimal(item.product.price);
            const effectiveQuantity = item.quantity <= item.product.stock ? item.quantity : item.product.stock;
            const subtotal = price.times(effectiveQuantity);
            const isUnavailable = item.product.stock === 0 || !item.product.isActive || item.product.deletedAt !== null;
            if (isUnavailable && item.selected) {
                idsToDeselect.push(item.id);
            }
            return {
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                price: price.toFixed(2),
                quantity: effectiveQuantity,
                maxStock: item.product.stock,
                selected: isUnavailable ? false : item.selected,
                unavailable: isUnavailable,
                image: item.product.images.find((image) => image.isCover === true)?.url,
                slug: item.product.slug,
                category: item.product.productCategories[0]?.category.name,
                subtotal: subtotal.toFixed(2)
            };
        });
        if (idsToDeselect.length > 0) {
            await this.cartRepository.updateManyCartItemSelection(idsToDeselect, false);
        }
        const total = items.reduce((acc, item) => acc.plus(item.subtotal), new Decimal(0));
        const selectedTotal = items
            .filter((item) => item.selected)
            .reduce((acc, item) => acc.plus(item.subtotal), new Decimal(0));
        return {
            id: cart.id,
            items,
            total: total.toFixed(2),
            selectedTotal: selectedTotal.toFixed(2)
        };
    }
    async updateCartItemSelection(userId, itemId, selected) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new HttpError("Cart not found", 404);
        }
        const item = cart.products.find((product) => product.id === itemId);
        if (!item) {
            throw new HttpError("Item not found in your cart", 404);
        }
        return await this.cartRepository.updateCartItemSelection(itemId, selected);
    }
    async addProductToCart(userId, data) {
        const product = await this.productRepository.getProductById(data.productId);
        if (!product) {
            throw new HttpError("Product not found", 404);
        }
        if (product.stock < data.quantity) {
            throw new HttpError("Insufficient stock", 400);
        }
        const cart = await this.cartRepository.getOrCreateCart(userId);
        const existingItem = await this.cartRepository.getCartItem(cart.id, data.productId);
        if (existingItem) {
            const newQuantity = existingItem.quantity + data.quantity;
            if (product.stock < newQuantity) {
                throw new HttpError("Insufficient stock", 400);
            }
            return await this.cartRepository.updateCartItemQuantity(existingItem.id, newQuantity);
        }
        return await this.cartRepository.addProductToCart(cart.id, data);
    }
    async updateCartItem(userId, itemId, data) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new HttpError("Cart not found", 404);
        }
        const item = cart.products.find((product) => product.id === itemId);
        if (!item) {
            throw new HttpError("Item not found in your cart", 404);
        }
        if (item.product.stock < data.quantity) {
            throw new HttpError("Insufficient stock", 400);
        }
        return await this.cartRepository.updateCartItemQuantity(itemId, data.quantity);
    }
    async removeProductFromCart(userId, itemId) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new HttpError("Cart not found", 404);
        }
        const item = cart.products.find((product) => product.id === itemId);
        if (!item) {
            throw new HttpError("Item not found in your cart", 404);
        }
        return await this.cartRepository.removeProductFromCart(itemId);
    }
    async clearCart(userId) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new HttpError("Cart not found", 404);
        }
        await this.cartRepository.clearCart(cart.id);
    }
}
//# sourceMappingURL=CartService.js.map