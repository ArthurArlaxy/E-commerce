import type { Order, Prisma } from "@prisma/client";
import type { DateLimit } from "../Schema/OrderSchema.js";
import { number } from "zod";

export type OrderItemInput = {
    productId: string
    nameSnapshot: string
    quantity: number
    priceSnapshot: Prisma.Decimal | string
}

export type ProductImageSnapshot = {
    id: string
    url: string
    isCover: boolean
}

export type CategorySnapshot = {
    id: string
    name: string
}

export type OrderListProduct = {
    slug: string
    images: ProductImageSnapshot[]
}

export type OrderDetailProduct = {
    id: string
    slug: string
    images: ProductImageSnapshot[]
    productCategories: { category: CategorySnapshot }[]
}

export type OrderListItem = Order & {
    products: {
        nameSnapshot: string
        quantity: number
        priceSnapshot: Prisma.Decimal
        product: OrderListProduct
    }[]
}

export type OrderWithItems = Order & {
    products: {
        id: string
        quantity: number
        priceSnapshot: Prisma.Decimal
        nameSnapshot: string
        product: OrderDetailProduct
    }[],
    shipping: {
        nameSnapshot: string
        priceSnapshot: Prisma.Decimal
        deliveryTimeSnapshot: number
    }
}

export interface AddressSnapshot {
    shippingStreet: string;
    shippingNumber: string | null;
    shippingComplement: string | null;
    shippingNeighborhood: string;
    shippingCity: string;
    shippingState: string;
}

export interface ShippingSnapshot {
    shippingId: string
    nameSnapshot: string
    priceSnapshot: Prisma.Decimal
    deliveryTimeSnapshot: number
}

export interface DashboardInfo {
    daily: {
        dayOrders: {
            total: Prisma.Decimal;
            createdAt: Date;
        }[];
        dayOrdersCount: number;
    };
    monthly: {
        monthOrders: {
            total: Prisma.Decimal;
            createdAt: Date;
        }[];
        monthOrdersCount: number;
    };
    yearly: {
        yearOrders: {
            total: Prisma.Decimal;
            createdAt: Date;
        }[];
        yearOrdersCount: number;
    };
    ordersByStatus: Array<{
        status: string
        _count: { id: number };
    }>;
    topProducts: Array<{
        nameSnapshot: string;
        _count: { id: number };
        _sum: { quantity: number | null };
    }>;
}

export interface OrderRepository {
    createOrder(userId: string, addressSnapshot: AddressSnapshot, shippingSnapshot: ShippingSnapshot, purchasedCartItemIds: string[], items: OrderItemInput[], total: string): Promise<OrderWithItems>
    getOrders(filter: Prisma.OrderWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: OrderListItem[], total: number }>
    getOrderById(id: string): Promise<OrderWithItems | null>
    updateOrderStatus(id: string, status: Order["status"]): Promise<Order>
    dashboardInfo(day: DateLimit, month: DateLimit, year: DateLimit): Promise<DashboardInfo>
}

