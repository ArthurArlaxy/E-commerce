import { Decimal } from "decimal.js";
import { HttpError } from "../Error/HttpError.js";
import type { OrderRepository, OrderItemInput } from "../Repository/OrderRepository.js";
import type { CartRepository } from "../Repository/CartRepository.js";
import type { AddressRepository } from "../Repository/AddressRepository.js";
import type { OrderQueryInput, UpdateOrderStatusInput } from "../Schema/OrderSchema.js";
import type { Prisma } from "@prisma/client";

export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private cartRepository: CartRepository,
        private addressRepository: AddressRepository
    ) { }

    async createOrder(userId: string, addressId: string) {
        const address = await this.addressRepository.getAddress(addressId)

        if (!address || address.userId !== userId) {
            throw new HttpError("Address not found", 404)
        }

        const cart = await this.cartRepository.getCartByUserId(userId)

        if (!cart || cart.products.length === 0) {
            throw new HttpError("Cart is empty", 400)
        }

        const selectedItems = cart.products.filter((item) => item.selected === true)

        if (selectedItems.length === 0) {
            throw new HttpError("No items selected for checkout", 400)
        }

        const items: OrderItemInput[] = []
        let total = new Decimal(0)

        for (const item of selectedItems) {
            if (item.product.stock < item.quantity) {
                throw new HttpError(`Insufficient stock for product ${item.product.name}`, 400)
            }

            const price = new Decimal(item.product.price as any)
            const subtotal = price.times(item.quantity)

            total = total.plus(subtotal)

            items.push({
                productId: item.productId,
                quantity: item.quantity,
                priceSnapshot: price.toFixed(2)
            })
        }

        return await this.orderRepository.createOrder(userId, addressId, selectedItems.map(i => i.id), items, total.toFixed(2))
    }

    async getOrders(query: OrderQueryInput, userId: string, isAdmin: boolean) {
        const filter: Prisma.OrderWhereInput = {}

        if (!isAdmin) {
            filter.userId = userId
        }

        if (query.status) {
            filter.status = query.status
        }

        const take = query.limit ?? 20
        const skip = query.page ? (query.page - 1) * take : 0

        return await this.orderRepository.getOrders(filter, query.orderBy ?? "createdAt", query.order ?? "desc", take, skip)
    }

    async getOrderById(id: string, userId: string, isAdmin: boolean) {
        if (typeof id !== "string") {
            throw new HttpError("Invalid Order ID", 400)
        }

        const order = await this.orderRepository.getOrderById(id)

        if (!order) {
            throw new HttpError("Order not found", 404)
        }

        if (order.userId !== userId && !isAdmin) {
            throw new HttpError("You can only view your own orders", 403)
        }

        return order
    }

    async updateOrderStatus(id: string, status: UpdateOrderStatusInput["status"]) {
        const order = await this.orderRepository.getOrderById(id)

        if (!order) {
            throw new HttpError("Order not found", 404)
        }

        return await this.orderRepository.updateOrderStatus(id, status)
    }
}