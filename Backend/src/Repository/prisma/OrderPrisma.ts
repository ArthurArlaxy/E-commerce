import type { Order, Prisma } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { OrderItemInput, OrderWithItems } from "../OrderRepository.js";

export class OrderPrisma {
    constructor() { }

    async createOrder(userId: string, addressId: string, purchasedCartItemIds: string[], items: OrderItemInput[], total: string): Promise<OrderWithItems> {
        return prisma.$transaction(async (transaction) => {
            const order = await transaction.order.create({
                data: { userId, addressId, total }
            })

            await transaction.orderProducts.createMany({
                data: items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceSnapshot: item.priceSnapshot 
                }))
            })

            for (const item of items) {
                await transaction.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            await transaction.productCart.deleteMany({
                where: { id: { in: purchasedCartItemIds } }
            })

            const fullOrder = await transaction.order.findUnique({
                where: { id: order.id },
                include: {
                    products: {
                        include: { product: { select: { id: true, name: true } } }
                    }
                }
            })

            return fullOrder as OrderWithItems
        })
    }

    async getOrders(filter: Prisma.OrderWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: Order[], total: number }> {
        const [items, total] = await prisma.$transaction([
            prisma.order.findMany({
                where: filter,
                orderBy: { [orderBy]: order },
                skip,
                take
            }),
            prisma.order.count({ where: filter })
        ])

        return { items, total }
    }

    async getOrderById(id: string): Promise<OrderWithItems | null> {
        return await prisma.order.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: { select: { id: true, name: true } }
                    }
                }
            }
        }) as OrderWithItems | null
    }

    async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
        return await prisma.order.update({
            where: { id },
            data: { status }
        })
    }
}