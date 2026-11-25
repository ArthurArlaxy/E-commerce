import type { ShippingRepository } from "../Repository/ShippingRepository.js";
import type { CreateShippingSchema, UpdateShippingSchema } from "../Schema/ShippingSchema.js";
export declare class ShippingService {
    private shippingRepository;
    constructor(shippingRepository: ShippingRepository);
    createShipping(data: CreateShippingSchema): Promise<{
        id: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        deliveryTime: number;
    }>;
    getShippings(): Promise<{
        id: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        deliveryTime: number;
    }[]>;
    getShippingById(id: string): Promise<{
        id: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        deliveryTime: number;
    }>;
    updateShipping(id: string, data: UpdateShippingSchema): Promise<{
        id: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        deliveryTime: number;
    }>;
    deleteShipping(id: string): Promise<{
        id: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        deliveryTime: number;
    }>;
}
//# sourceMappingURL=ShippingService.d.ts.map