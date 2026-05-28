import type { Address } from "@prisma/client";
import type { CreateAddressInput, UpdateAddressInput } from "../../Schema/AddressSchema.js";
import { Mapper } from "../../helpers/mappers.js";
import { prisma } from "../../Database/index.js";

export class AddressPrisma {
    constructor(){}

    async createAddress(data:CreateAddressInput): Promise<Address>{
        return prisma.address.create({ data: Mapper.toCreate(data) })
    }

    async getAddresses(userId:string):Promise<Address[]>{
        return prisma.address.findMany({
            where:{ userId }
        })
    }

    async updateAddress(id:string, data: UpdateAddressInput): Promise<Address>{
        return prisma.address.update({
            where: { id },
            data: Mapper.toUpdate(data)
        })
    }
}