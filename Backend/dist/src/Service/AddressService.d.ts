import type { AddressRepository } from "../Repository/AddressRepository.js";
import type { CreateAddressInput, UpdateAddressInput } from "../Schema/AddressSchema.js";
export declare class AddressService {
    private addressRepository;
    constructor(addressRepository: AddressRepository);
    createAddress(data: CreateAddressInput): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    }>;
    getUserAddresses(userId: string): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    }[]>;
    getAllAddresses(): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    }[]>;
    getAddress(id: string): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    }>;
    updateAddress(id: string, data: UpdateAddressInput): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    }>;
    deleteAddress(id: string, userId: string): Promise<{
        number: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        isPrimary: boolean;
        userId: string;
    } | null>;
}
//# sourceMappingURL=AddressService.d.ts.map