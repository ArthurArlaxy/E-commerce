import type { Order, Prisma } from "@prisma/client";
import type { AddressSnapshot, OrderItemInput, OrderListItem, OrderWithItems, PaymentData, ShippingSnapshot } from "../OrderRepository.js";
import type { DateLimit } from "../../Schema/OrderSchema.js";
export declare class OrderPrisma {
    constructor();
    createOrder(userId: string, addressSnapshot: AddressSnapshot, shippingSnapshot: ShippingSnapshot, items: OrderItemInput[], total: string): Promise<OrderWithItems>;
    getOrders(filter: Prisma.OrderWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{
        items: OrderListItem[];
        total: number;
    }>;
    getOrderById(id: string): Promise<OrderWithItems | null>;
    updateOrderStatus(id: string, status: Order["status"]): Promise<Order>;
    setPayment(id: string, data: PaymentData): Promise<Order>;
    getOrderPayment(orderId: string): Promise<{
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        paymentExpireAt: Date | null;
    } | null>;
    markAsPaid(orderId: string): Promise<boolean>;
    getExpiredPendingOrderIds(): Promise<string[]>;
    cancelIfUnpaid(orderId: string): Promise<boolean>;
    dashboardInfo(day: DateLimit, month: DateLimit, year: DateLimit): Promise<{
        daily: {
            dayOrders: {
                createdAt: Date;
                total: Prisma.Decimal;
            }[];
            dayOrdersCount: number;
        };
        monthly: {
            monthOrders: {
                createdAt: Date;
                total: Prisma.Decimal;
            }[];
            monthOrdersCount: number;
        };
        yearly: {
            yearOrders: {
                createdAt: Date;
                total: Prisma.Decimal;
            }[];
            yearOrdersCount: number;
        };
        ordersByStatus: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        topProducts: (Prisma.PickEnumerable<Prisma.OrderProductsGroupByOutputType, "nameSnapshot"[]> & {
            _count: {
                id: number;
            };
            _sum: {
                quantity: number | null;
            };
        })[];
    }>;
}
//# sourceMappingURL=OrderPrisma.d.ts.map