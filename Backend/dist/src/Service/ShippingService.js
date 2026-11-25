import { HttpError } from "../Error/HttpError.js";
export class ShippingService {
    shippingRepository;
    constructor(shippingRepository) {
        this.shippingRepository = shippingRepository;
    }
    async createShipping(data) {
        if (data.deliveryTime > 60)
            throw new HttpError("Delivery time cannot exceed 60 days", 400);
        return await this.shippingRepository.createShipping(data);
    }
    async getShippings() {
        const shipping = await this.shippingRepository.getShippings();
        if (shipping.length === 0) {
            throw new HttpError("Shipping not found, create shipping", 400);
        }
        return shipping;
    }
    async getShippingById(id) {
        const shipping = await this.shippingRepository.getShippingById(id);
        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400);
        }
        return shipping;
    }
    async updateShipping(id, data) {
        const shipping = await this.shippingRepository.getShippingById(id);
        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400);
        }
        const updatedShipping = await this.shippingRepository.updateShipping(id, data);
        return updatedShipping;
    }
    async deleteShipping(id) {
        const shipping = await this.shippingRepository.getShippingById(id);
        if (!shipping) {
            throw new HttpError("Invalid shipping id", 400);
        }
        const deletedShipping = await this.shippingRepository.deleteShipping(id);
        return deletedShipping;
    }
}
//# sourceMappingURL=ShippingService.js.map