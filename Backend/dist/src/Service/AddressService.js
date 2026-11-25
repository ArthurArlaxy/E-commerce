import { HttpError } from "../Error/HttpError.js";
export class AddressService {
    addressRepository;
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    async createAddress(data) {
        const userAddresses = await this.addressRepository.getUserAddresses(data.userId);
        if (userAddresses.length >= 3) {
            throw new HttpError("Limit address: 3", 400);
        }
        const isFirst = userAddresses.length === 0;
        const shouldBePrimary = isFirst || data.isPrimary === true;
        return this.addressRepository.createAddress({
            ...data,
            isPrimary: shouldBePrimary
        });
    }
    async getUserAddresses(userId) {
        return await this.addressRepository.getUserAddresses(userId);
    }
    async getAllAddresses() {
        return await this.addressRepository.getAllAddresses();
    }
    async getAddress(id) {
        const address = await this.addressRepository.getAddress(id);
        if (!address)
            throw new HttpError("Address not found", 404);
        return address;
    }
    async updateAddress(id, data) {
        const address = await this.addressRepository.getAddress(id);
        if (!address)
            throw new HttpError("Address not found", 404);
        if (address.userId !== data.userId)
            throw new HttpError("Unauthorized", 403);
        try {
            return await this.addressRepository.updateAddress(id, data);
        }
        catch (error) {
            throw new HttpError("Address not found", 404);
        }
    }
    async deleteAddress(id, userId) {
        const address = await this.addressRepository.getAddress(id);
        if (!address)
            throw new HttpError("Address not found", 404);
        if (address.userId !== userId)
            throw new HttpError("Unauthorized", 403);
        if (address.isPrimary === true)
            throw new HttpError("Não é permitido excluir o endereço principal", 400);
        try {
            return await this.addressRepository.deleteAddress(id);
        }
        catch (error) {
            throw new HttpError("Address not found", 404);
        }
    }
}
//# sourceMappingURL=AddressService.js.map