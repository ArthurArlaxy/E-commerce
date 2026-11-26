import type { CartRepository } from "../Repository/CartRepository.js";
import type { ProductRepository } from "../Repository/ProductRepository.js";
import type { AddProductToCartInput, UpdateCartItemInput } from "../Schema/CartSchema.js";
export declare class CartService {
    private cartRepository;
    private productRepository;
    constructor(cartRepository: CartRepository, productRepository: ProductRepository);
    getCart(userId: string): Promise<{
        id: null;
        items: never[];
        total: string;
        selectedTotal: string;
    } | {
        id: string;
        items: {
            id: string;
            productId: string;
            name: string;
            price: string;
            quantity: number;
            maxStock: number;
            selected: boolean;
            unavailable: boolean;
            image: string | undefined;
            slug: string;
            category: string | undefined;
            subtotal: string;
        }[];
        total: string;
        selectedTotal: string;
    }>;
    updateCartItemSelection(userId: string, itemId: string, selected: boolean): Promise<{
        id: string;
        productId: string;
        quantity: number;
        selected: boolean;
        cartId: string;
    }>;
    addProductToCart(userId: string, data: AddProductToCartInput): Promise<{
        id: string;
        productId: string;
        quantity: number;
        selected: boolean;
        cartId: string;
    }>;
    updateCartItem(userId: string, itemId: string, data: UpdateCartItemInput): Promise<{
        id: string;
        productId: string;
        quantity: number;
        selected: boolean;
        cartId: string;
    }>;
    removeProductFromCart(userId: string, itemId: string): Promise<{
        id: string;
        productId: string;
        quantity: number;
        selected: boolean;
        cartId: string;
    }>;
    clearCart(userId: string): Promise<void>;
}
//# sourceMappingURL=CartService.d.ts.map