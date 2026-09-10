import type { Shipping } from "@prisma/client";
import type { CreateShippingSchema, UpdateShippingSchema } from "../Schema/ShippingSchema.js";

export interface ShippingRepository{
    createShipping(data: CreateShippingSchema): Promise<Shipping>
    getShippings(): Promise<Shipping[]>
    getShippingById(id: string): Promise<Shipping | null>
    updateShipping(id: string, data: UpdateShippingSchema): Promise<Shipping>
    deleteShipping(id:string): Promise<Shipping>
}