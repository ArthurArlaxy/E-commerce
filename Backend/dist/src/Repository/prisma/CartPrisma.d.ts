import type { Cart, ProductCart } from "@prisma/client";
import type { AddProductToCartInput } from "../../Schema/CartSchema.js";
import type { CartWithItems } from "../CartRepository.js";
export declare class CartPrisma {
    constructor();
    getOrCreateCart(userId: string): Promise<Cart>;
    getCartByUserId(userId: string): Promise<CartWithItems | null>;
    getCartItem(cartId: string, productId: string): Promise<ProductCart | null>;
    addProductToCart(cartId: string, data: AddProductToCartInput): Promise<ProductCart>;
    updateCartItemQuantity(id: string, quantity: number): Promise<ProductCart>;
    updateCartItemSelection(id: string, selected: boolean): Promise<ProductCart>;
    updateManyCartItemSelection(ids: string[], selected: boolean): Promise<void>;
    removeProductFromCart(id: string): Promise<ProductCart>;
    removeItems(purchasedCartItemIds: string[]): Promise<void>;
    clearCart(cartId: string): Promise<void>;
}
//# sourceMappingURL=CartPrisma.d.ts.map