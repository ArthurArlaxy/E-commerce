import { HttpError } from "../Error/HttpError.js";
import type { ShippingRepository } from "../Repository/ShippingRepository.js";
import type { CreateShippingSchema, UpdateShippingSchema } from "../Schema/ShippingSchema.js";

export class ShippingService {
    constructor(private shippingRepository: ShippingRepository) { }

    async createShipping(data: CreateShippingSchema) {

        if (data.deliveryTime > 60) throw new HttpError("Delivery time cannot exceed 60 days", 400);

        return await this.shippingRepository.createShipping(data)
    }

    async getShippings() {
        const shipping = await this.shippingRepository.getShippings()

        if (shipping.length === 0) {
            throw new HttpError("Shipping not found, create shipping", 400)
        }

        return shipping
    }

    async getShippingById(id: string) {
        const shipping = await this.shippingRepository.getShippingById(id)

        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400)
        }

        return shipping
    }

    async updateShipping(id: string, data: UpdateShippingSchema) {
        const shipping = await this.shippingRepository.getShippingById(id)

        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400)
        }

        const updatedShipping = await this.shippingRepository.updateShipping(id, data)

        return updatedShipping
    }

    async deleteShipping(id: string) {
        const shipping = await this.shippingRepository.getShippingById(id)

        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400)
        }

        const deletedShipping = await this.shippingRepository.deleteShipping(id)

        return deletedShipping
    }
}