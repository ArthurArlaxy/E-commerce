import type { Cart, Prisma, ProductCart } from "@prisma/client";
import type { AddProductToCartInput } from "../Schema/CartSchema.js";

export type CartWithItems = Cart & {
    products: ({
        product: {
            name: string;
            id: string;
            price: Prisma.Decimal;
            stock: number;
            slug: string;
            isActive: boolean;
            deletedAt: Date | null;
            images: {
                isCover: boolean;
                url: string;
            }[];
            productCategories: {
                category: {
                    name: string;
                };
            }[];
        };
    } & {
        id: string;
        quantity: number;
        selected: boolean;
        productId: string;
        cartId: string;
    })[];
};

export interface CartRepository {
    getOrCreateCart(userId: string): Promise<Cart>
    getCartByUserId(userId: string): Promise<CartWithItems | null>
    getCartItem(cartId: string, productId: string): Promise<ProductCart | null>
    addProductToCart(cartId: string, data: AddProductToCartInput): Promise<ProductCart>
    updateCartItemQuantity(id: string, quantity: number): Promise<ProductCart>
    updateCartItemSelection(id: string, selected: boolean): Promise<ProductCart>
    updateManyCartItemSelection(ids:string[], select: boolean): Promise<void>
    removeProductFromCart(id: string): Promise<ProductCart>
    clearCart(cartId: string): Promise<void>
}