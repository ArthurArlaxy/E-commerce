import type { Handler } from "express";
import type { CartService } from "../Service/CartService.js";
import { addProductToCartSchema, updateCartItemSchema, cartItemIdParamSchema } from "../Schema/CartSchema.js";
import { HttpError } from "../Error/HttpError.js";

export class CartController {
    constructor(private cartService: CartService) { }

    getCart: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const response = await this.cartService.getCart(req.user.id)

        return res.json(response)
    }

    addProductToCart: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const body = addProductToCartSchema.parse(req.body)

        const response = await this.cartService.addProductToCart(req.user.id, body)

        return res.status(201).json(response)
    }

    updateCartItem: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const { id } = cartItemIdParamSchema.parse(req.params)
        const body = updateCartItemSchema.parse(req.body)

        const response = await this.cartService.updateCartItem(req.user.id, id, body)

        return res.json(response)
    }

    removeProductFromCart: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const { id } = cartItemIdParamSchema.parse(req.params)

        const response = await this.cartService.removeProductFromCart(req.user.id, id)

        return res.json(response)
    }

    clearCart: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        await this.cartService.clearCart(req.user.id)

        return res.status(204).send()
    }
}