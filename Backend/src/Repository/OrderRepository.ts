import type { Order, Prisma } from "@prisma/client";

export type OrderItemInput = {
    productId: string
    quantity: number
    priceSnapshot: Prisma.Decimal | string
}

export type OrderWithItems = Order & {
    products: {
        id: string
        quantity: number
        priceSnapshot: unknown
        product: { id: string, name: string }
    }[]
}

export interface OrderRepository {
    createOrder(userId: string, addressId: string, purchasedCartItemIds: string[], items: OrderItemInput[], total: string): Promise<OrderWithItems>
    getOrders(filter: Prisma.OrderWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: Order[], total: number }>
    getOrderById(id: string): Promise<OrderWithItems | null>
    updateOrderStatus(id: string, status: Order["status"]): Promise<Order>
}