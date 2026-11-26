import type { Handler } from "express";
import type { ShippingService } from "../Service/ShippingService.js";
export declare class ShippingController {
    private shippingService;
    constructor(shippingService: ShippingService);
    createShipping: Handler;
    getShippings: Handler;
    getShippindById: Handler;
    updateShipping: Handler;
    deleteShipping: Handler;
}
//# sourceMappingURL=ShippingController.d.ts.map