import type { OrderRepository } from "../Repository/OrderRepository.js";
import type { CartRepository } from "../Repository/CartRepository.js";
import type { AddressRepository } from "../Repository/AddressRepository.js";
import type { OrderQueryInput, UpdateOrderStatusInput } from "../Schema/OrderSchema.js";
import type { Prisma } from "@prisma/client";
import type { ShippingRepository } from "../Repository/ShippingRepository.js";
export declare class OrderService {
    private orderRepository;
    private cartRepository;
    private addressRepository;
    private shippingRepository;
    constructor(orderRepository: OrderRepository, cartRepository: CartRepository, addressRepository: AddressRepository, shippingRepository: ShippingRepository);
    createOrder(userId: string, addressId: string, shippingId: string): Promise<{
        orderId: string;
        paymentExpireAt: Date;
        brCode: any;
        brCodeBase64: any;
    }>;
    getOrders(query: OrderQueryInput, userId: string, isAdmin: boolean): Promise<{
        items: import("../Repository/OrderRepository.js").OrderListItem[];
        total: number;
    }>;
    getOrderById(id: string, userId: string, isAdmin: boolean): Promise<import("../Repository/OrderRepository.js").OrderWithItems>;
    updateOrderStatus(id: string, status: UpdateOrderStatusInput["status"]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        userId: string;
        total: Prisma.Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        paymentExpireAt: Date | null;
        paymentPaidAt: Date | null;
        paymentBrCode: string | null;
        shippingCity: string;
        shippingComplement: string | null;
        shippingNeighborhood: string;
        shippingNumber: string | null;
        shippingState: string;
        shippingStreet: string;
        shippingZipCode: string;
    }>;
    getDashboardInfo(): Promise<import("../Repository/OrderRepository.js").DashboardInfo>;
}
//# sourceMappingURL=OrderService.d.ts.map