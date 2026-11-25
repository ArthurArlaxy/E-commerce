import type { Handler } from "express";
import type { OrderService } from "../Service/OrderService.js";
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    createOrder: Handler;
    getOrders: Handler;
    getDashboardInfo: Handler;
    getOrderById: Handler;
    updateOrderStatus: Handler;
}
//# sourceMappingURL=OrderController.d.ts.map