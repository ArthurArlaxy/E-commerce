import type { Address } from "@prisma/client";
import type { CreateAddressInput, UpdateAddressInput } from "../../Schema/AddressSchema.js";

import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";
import { HttpError } from "../../Error/HttpError.js";

export class AddressPrisma {
    constructor() { }

    async createAddress(data: CreateAddressInput): Promise<Address> {

        return prisma.$transaction(async (transaction) => {

            // validação defensiva para concorrência
            const count = await transaction.address.count({
                where: { userId: data.userId }
            })

            if (count >= 3) {
                throw new HttpError("Limit address: 3", 400)
            }

            if (data.isPrimary) {
                await transaction.address.updateMany({
                    where: {
                        userId: data.userId,
                        isPrimary: true
                    },
                    data: { isPrimary: false }
                })
            }

            return transaction.address.create({
                data: toCreate(data)
            })
        })
    }

    async getUserAddresses(userId: string): Promise<Address[]> {
        return prisma.address.findMany({
            where: { userId }
        })
    }

    async getAddresses(): Promise<Address[]> {
        return prisma.address.findMany()
    }

    async getAddress(id: string): Promise<Address | null> {
        return prisma.address.findUnique({ where: { id } })
    }

    async updateAddress(id: string, data: UpdateAddressInput): Promise<Address> {
        return prisma.$transaction(async (transaction) => {

            if (data.isPrimary) {
                await transaction.address.updateMany({
                    where: {
                        userId: data.userId,
                        isPrimary: true
                    },
                    data: { isPrimary: false }
                })
            }

            return transaction.address.update({
                where: { id },
                data: toUpdate(data)
            })
        })

    }

    async deleteAddress(id: string): Promise<Address | null> {
        return prisma.address.delete({
            where: { id }
        })
    }
}