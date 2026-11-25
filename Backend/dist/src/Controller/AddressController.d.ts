import type { Handler } from "express";
import type { AddressService } from "../Service/AddressService.js";
export declare class AddressController {
    private addressService;
    constructor(addressService: AddressService);
    createAddress: Handler;
    getUserAddresses: Handler;
    getAllAddresses: Handler;
    getAddress: Handler;
    updateAddress: Handler;
    deleteAddress: Handler;
}
//# sourceMappingURL=AddressController.d.ts.map