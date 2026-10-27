import { Decimal } from "decimal.js";
import { HttpError } from "../Error/HttpError.js";
import type { OrderRepository, OrderItemInput } from "../Repository/OrderRepository.js";
import type { CartRepository } from "../Repository/CartRepository.js";
import type { AddressRepository } from "../Repository/AddressRepository.js";
import type { OrderQueryInput, UpdateOrderStatusInput } from "../Schema/OrderSchema.js";
import type { Order, Prisma } from "@prisma/client";
import type { ShippingRepository } from "../Repository/ShippingRepository.js";
import type { string } from "zod";
import { paymentQueue } from "../queue.js";

const PAYMENT_WINDOW_MS = 30 * 60 * 1000

export class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private cartRepository: CartRepository,
        private addressRepository: AddressRepository,
        private shippingRepository: ShippingRepository
    ) { }

    async createOrder(userId: string, addressId: string, shippingId: string) {
        const address = await this.addressRepository.getAddress(addressId)

        if (!address || address.userId !== userId) {
            throw new HttpError("Address not found", 404)
        }

        const addressSnapshot = {
            shippingStreet: address.street,
            shippingNumber: address.number || null,
            shippingComplement: address.complement || null,
            shippingNeighborhood: address.neighborhood,
            shippingCity: address.city,
            shippingState: address.state,
            shippingZipCode: address.zipCode
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
            if (item.product.stock === 0 || item.product.stock < item.quantity) {
                throw new HttpError(`Insufficient stock for product ${item.product.name}`, 400)
            }

            const price = new Decimal(item.product.price as any)
            const subtotal = price.times(item.quantity)

            total = total.plus(subtotal)

            items.push({
                productId: item.productId,
                quantity: item.quantity,
                nameSnapshot: item.product.name,
                priceSnapshot: price.toFixed(2)
            })
        }

        const shipping = await this.shippingRepository.getShippingById(shippingId)

        if (!shipping) {
            throw new HttpError("Type of hipping not found", 400)
        }


        const shippingPrice = new Decimal(shipping.price)

        total = total.plus(shippingPrice)

        const shippingSnapshot = {
            shippingId: shipping.id,
            nameSnapshot: shipping.name,
            priceSnapshot: shipping.price,
            deliveryTimeSnapshot: shipping.deliveryTime
        }

        let order: Order

        try {
            order = await this.orderRepository.createOrder(userId, addressSnapshot, shippingSnapshot, items, total.toFixed(2))
        } catch (error) {
            throw new HttpError("An error occurred while creating the order.", 500)
        }

        let priceInCents = Number(total.toFixed(2).replace(".", ""))
        console.log(priceInCents)

        let payment

        try {
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: 'PIX',
                    data: {
                        amount: priceInCents,
                        expiresIn: 1800,
                        description: 'Pagamento dos produtos selecionados',
                        externalId: order.id
                    }
                })
            };

            const response = await fetch('https://api.abacatepay.com/v2/transparents/create', options)

            console.log(response)

            if (!response.ok) {
                throw new HttpError("Erro ao criar a cobrança", 500)
            }

            const body = await response.json()

            payment = body.data

            console.log(payment)

        } catch (error) {
            await this.orderRepository.cancelIfUnpaid(order.id).catch(console.error)
            throw new HttpError("Erro ao criar a cobrança", 502)
        }
        const expireAt = new Date(Date.now() + PAYMENT_WINDOW_MS)

        await this.orderRepository.setPayment(order.id, { paymentId: payment.id, paymentExpireAt: expireAt, paymentBrCode: payment.brCode })

        try {
            await paymentQueue.add(
                'check-payment',
                { orderId: order.id },
                { delay: 10_000, removeOnComplete: true }
            )
        } catch (error) {
            console.error('Falha ao agendar a checagem; Porém o sweep cobre', order.id, error)
        }

        await this.cartRepository.removeItems(selectedItems.map(i => i.id)).catch((error) =>
            console.error('Falha ao limpar o carrinho', order.id, error)
        )

        return {
            orderId: order.id,
            paymentExpireAt: expireAt,
            brCode: payment.brCode,
            brCodeBase64: payment.brCodeBase64
        }

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

        if (order.status !== "pending") {
            return { ...order, paymentBrCode: null }
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

    async getDashboardInfo() {

        const agora = new Date();
        const day = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const currentMonth = new Date(day.getFullYear(), day.getMonth(), 1)
        const currentYear = new Date(day.getFullYear(), 0, 1)
        const nextDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
        const nextMonth = new Date(day.getFullYear(), day.getMonth() + 1, 1)
        const nextYear = new Date(day.getFullYear() + 1, 0, 1)

        const dayTime = {
            gte: day,
            lt: nextDay
        }

        const monthTime = {
            gte: currentMonth,
            lt: nextMonth
        }
        const yearTime = {
            gte: currentYear,
            lt: nextYear
        }

        return this.orderRepository.dashboardInfo(dayTime, monthTime, yearTime)
    }
}