import type { Handler } from "express";
import type { CartService } from "../Service/CartService.js";
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart: Handler;
    addProductToCart: Handler;
    updateCartItem: Handler;
    updateCartItemSelection: Handler;
    removeProductFromCart: Handler;
    clearCart: Handler;
}
//# sourceMappingURL=CartController.d.ts.map