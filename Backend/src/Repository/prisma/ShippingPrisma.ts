import type { Shipping } from "@prisma/client";
import type { CreateShippingSchema, UpdateShippingSchema } from "../../Schema/ShippingSchema.js";
import { prisma } from "../../Database/index.js";

export class ShippingPrisma {
    constructor() { }

    async createShipping(data: CreateShippingSchema): Promise<Shipping> {
        const shipping = await prisma.shipping.create({ data })
        return shipping
    }

    async getShippings(): Promise<Shipping[]> {
        return await prisma.shipping.findMany()
    }

    async getShippingById(id: string): Promise<Shipping | null> {
        return await prisma.shipping.findUnique({ where: { id } })
    }

    async updateShipping(id: string, data: UpdateShippingSchema): Promise<Shipping> {
        return await prisma.shipping.update({
            where: { id },
            data
        })
    }

    async deleteShipping(id: string): Promise<Shipping> {
        return await prisma.shipping.delete({ where: { id } })
    }
}