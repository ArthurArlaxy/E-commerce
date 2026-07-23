import type { Handler } from "express";
import type { OrderService } from "../Service/OrderService.js";
import { createOrderSchema, updateOrderStatusSchema, orderQuerySchema, idParamSchema } from "../Schema/OrderSchema.js";
import { HttpError } from "../Error/HttpError.js";

export class OrderController {
    constructor(private orderService: OrderService) { }

    createOrder: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const { addressId } = createOrderSchema.parse(req.body)

        const response = await this.orderService.createOrder(req.user.id, addressId)

        return res.status(201).json(response)
    }

    getOrders: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const query = orderQuerySchema.parse(req.query)
        const isAdmin = req.user.role === "admin"

        const response = await this.orderService.getOrders(query, req.user.id, isAdmin)

        return res.json(response)
    }

    getOrderById: Handler = async (req, res, next) => {
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401)
        }

        const { id } = idParamSchema.parse(req.params)
        const isAdmin = req.user.role === "admin"

        const response = await this.orderService.getOrderById(id, req.user.id, isAdmin)

        return res.json(response)
    }

    updateOrderStatus: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)
        const { status } = updateOrderStatusSchema.parse(req.body)

        const response = await this.orderService.updateOrderStatus(id, status)

        return res.json(response)
    }
}