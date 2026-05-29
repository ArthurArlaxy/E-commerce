import type { Address } from "@prisma/client";
import type { CreateAddressInput, UpdateAddressInput } from "../Schema/AddressSchema.js";

export interface AddressRepository{
    createAddress(data:CreateAddressInput): Promise<Address>
    getUserAddresses(userId:string): Promise<Address[]>
    getAddresses(): Promise<Address[]>
    getAddress(id:string): Promise<Address>
    updateAddress(id: string, data: UpdateAddressInput): Promise<Address>
    deleteAddress(id:string): Promise<Address | null>
    createPrimaryAddress(data: CreateAddressInput, oldPrimaryAddress?: string): Promise<Address | null>
}