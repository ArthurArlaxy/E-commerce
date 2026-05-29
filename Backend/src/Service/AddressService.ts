import { HttpError } from "../Error/HttpError.js"
import type { AddressRepository } from "../Repository/AddressRepository.js"
import type { CreateAddressInput, UpdateAddressInput } from "../Schema/AddressSchema.js"

export class AddressService {
    constructor(private addressRepository: AddressRepository) { }

    async createAddress(data: CreateAddressInput) {

        const userAddresses = await this.addressRepository.getUserAddresses(data.userId)

        // regra de negócio explícita
        if (userAddresses.length >= 3) {
            throw new HttpError("Limit address: 3", 400)
        }

        const isFirst = userAddresses.length === 0

        const shouldBePrimary =
            isFirst || data.isPrimary === true

        return this.addressRepository.createAddress({
            ...data,
            isPrimary: shouldBePrimary
        })
    }

    async getUserAddresses(userId: string) {
        return await this.addressRepository.getUserAddresses(userId)
    }

    async getAddresses() {
        return await this.addressRepository.getAddresses()
    }

    async getAddress(id: string) {
        const address = await this.addressRepository.getAddress(id)

        if (!address) throw new HttpError("Address not found", 404)

        return address
    }

    async updateAddress(id: string, data: UpdateAddressInput) {
        try {
            const address = await this.addressRepository.getAddress(id)

            if (!address) throw new HttpError("Address not found", 404)
            if (address.userId !== data.userId) throw new HttpError("Unauthorized", 403)

            return await this.addressRepository.updateAddress(id, data)
        } catch (error) {
            throw new HttpError("Address not found", 404)
        }
    }

    async deleteAddress(id: string, userId: string) {
        const address = await this.addressRepository.getAddress(id)

        if (!address) throw new HttpError("Address not found", 404)
        if (address.userId !== userId) throw new HttpError("Unauthorized", 403)

        try {
            return await this.addressRepository.deleteAddress(id)
        } catch (error) {
            throw new HttpError("Address not found", 404)
        }
    }
}