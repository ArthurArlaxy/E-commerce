import type { Address } from "@prisma/client";
import type { CreateAddressInput, UpdateAddressInput } from "../Schema/AddressSchema.js";

export interface AddressRepository{
    createAddress(data:CreateAddressInput): Promise<Address>
    getUserAddresses(userId:string): Promise<Address[]>
    getAllAddresses(): Promise<Address[]>
    getAddress(id:string): Promise<Address | null>
    updateAddress(id: string, data: UpdateAddressInput): Promise<Address>
    deleteAddress(id:string): Promise<Address | null>
}