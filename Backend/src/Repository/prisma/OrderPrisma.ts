import type { Order, Prisma } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { AddressSnapshot, OrderItemInput, OrderListItem, OrderWithItems, PaymentData, ShippingSnapshot } from "../OrderRepository.js";
import type { DateLimit } from "../../Schema/OrderSchema.js";
import { HttpError } from "../../Error/HttpError.js";

const orderListInclude = {
    products: {
        select: {
            nameSnapshot: true,
            quantity: true,
            priceSnapshot: true,
            product: {
                select: {
                    slug: true,
                    images: {
                        where: { isCover: true }
                    }
                }
            }
        }
    }
}

const orderDetailInclude = {
    products: {
        include: {
            product: {
                select: {
                    id: true,
                    slug: true,
                    images: {
                        where: { isCover: true }
                    },
                    productCategories: {
                        select: {
                            category: {
                                select: { id: true, name: true }
                            }
                        }
                    }
                }
            }
        }
    },
    shipping: {
        select: { nameSnapshot: true, priceSnapshot: true, deliveryTimeSnapshot: true }
    }
}

export class OrderPrisma {
    constructor() { }

    async createOrder(userId: string, addressSnapshot: AddressSnapshot, shippingSnapshot: ShippingSnapshot, items: OrderItemInput[], total: string): Promise<OrderWithItems> {
        return prisma.$transaction(async (transaction) => {
            const order = await transaction.order.create({
                data: { userId, ...addressSnapshot, total }
            })

            await transaction.orderProducts.createMany({
                data: items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    nameSnapshot: item.nameSnapshot,
                    quantity: item.quantity,
                    priceSnapshot: item.priceSnapshot
                }))
            })

            await transaction.orderShipping.create({
                data: {
                    orderId: order.id,
                    ...shippingSnapshot
                }
            })

            for (const item of items) {
                const { count } = await transaction.product.updateMany({
                    where: { id: item.productId, stock: { gte: item.quantity } },
                    data: { stock: { decrement: item.quantity } }
                })

                if (count === 0) {
                    throw new HttpError(`Insufficient stock for product ${item.nameSnapshot}`, 400)
                }
            }

            const fullOrder = await transaction.order.findUnique({
                where: { id: order.id },
                include: orderDetailInclude
            })

            return fullOrder as OrderWithItems
        })
    }

    async getOrders(filter: Prisma.OrderWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: OrderListItem[], total: number }> {
        const [items, total] = await prisma.$transaction([
            prisma.order.findMany({
                where: filter,
                orderBy: { [orderBy]: order },
                skip,
                take,
                include: orderListInclude
            }),
            prisma.order.count({ where: filter })
        ])

        return { items: items, total }
    }

    async getOrderById(id: string): Promise<OrderWithItems | null> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: orderDetailInclude
        })

        return order as OrderWithItems | null
    }

    async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
        return await prisma.order.update({
            where: { id },
            data: { status }
        })
    }

    async setPayment(id: string, data: PaymentData): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data
        })
    }

    async getOrderPayment(orderId: string) {
        return prisma.order.findUnique({
            where: { id: orderId },
            select: { status: true, paymentId: true, paymentExpireAt: true, createdAt: true }
        })
    }

    async markAsPaid(orderId: string): Promise<boolean> {
        const { count } = await prisma.order.updateMany({
            where: { id: orderId, status: 'pending' },
            data: { status: 'paid', paymentPaidAt: new Date() }
        })
        return count > 0
    }

    async getExpiredPendingOrderIds(): Promise<string[]> {
        const orders = await prisma.order.findMany({
            where: {
                status: 'pending',
                OR: [
                    { paymentExpireAt: { lt: new Date() } },
                    { paymentExpireAt: null, createdAt: { lt: new Date(Date.now() - 40 * 60_000) } }
                ]
            },
            select: { id: true },
            take: 100
        })
        return orders.map(order => order.id)
    }

    async cancelIfUnpaid(orderId: string): Promise<boolean> {
        return prisma.$transaction(async (transaction) => {
            const { count } = await transaction.order.updateMany({
                where: { id: orderId, status: 'pending' },
                data: { status: 'cancelled' }
            })

            if (count === 0) return false

            const items = await transaction.orderProducts.findMany({
                where: { orderId },
                select: { productId: true, quantity: true },
                orderBy: { productId: 'asc' }
            })

            for (const item of items) {
                await transaction.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                })
            }

            return true
        })
    }

    async dashboardInfo(day: DateLimit, month: DateLimit, year: DateLimit) {

        return prisma.$transaction(async (transaction) => {

            const dayOrders = await transaction.order.findMany({
                where: { createdAt: { ...day }, status: { not: "cancelled" } },
                select: {
                    total: true,
                    createdAt: true
                }
            })

            const dayOrdersCount = await transaction.order.count({
                where: { createdAt: { ...day }, status: { not: "cancelled" } },
            })

            const monthOrders = await transaction.order.findMany({
                where: { createdAt: { ...month }, status: { not: "cancelled" } },
                select: {
                    total: true,
                    createdAt: true,
                }
            })

            const monthOrdersCount = await transaction.order.count({
                where: { createdAt: { ...month }, status: { not: "cancelled" } },
            })

            const yearOrders = await transaction.order.findMany({
                where: { createdAt: { ...year }, status: { not: "cancelled" } },
                select: {
                    total: true,
                    createdAt: true
                },

            })

            const yearOrdersCount = await transaction.order.count({
                where: { createdAt: { ...year }, status: { not: "cancelled" } }
            })

            const ordersByStatus = await transaction.order.groupBy({
                by: ['status'],
                _count: { id: true },
                where: { createdAt: { ...year } }
            })

            const topProducts = await transaction.orderProducts.groupBy({
                where: {
                    order: {
                        status: { not: "cancelled" }
                    }
                },
                by: ['nameSnapshot'],
                _sum: { quantity: true },
                _count: { id: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            })

            return { daily: { dayOrders, dayOrdersCount }, monthly: { monthOrders, monthOrdersCount }, yearly: { yearOrders, yearOrdersCount }, ordersByStatus, topProducts }

        })
    }

}