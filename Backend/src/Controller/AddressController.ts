import type { Handler } from "express";
import type { AddressService } from "../Service/AddressService.js";
import { createAddressSchema, updateAddressSchema } from "../Schema/AddressSchema.js";
import { HttpError } from "../Error/HttpError.js";

export class AddressController {
    constructor(private addressService: AddressService) { }

    createAddress: Handler = async (req, res, next) => {
        try {
            if (!req.user) throw new HttpError("Authentication required", 401)

            req.body.userId = req.user.id

            const data = createAddressSchema.parse(req.body)

            const newAddress = await this.addressService.createAddress(data)
            res.status(201).json(newAddress)
        } catch (error) {
            next(error)
        }

    }
    getUserAddresses: Handler = async (req, res, next) => {
        try {
            if (!req.user) throw new HttpError("Authentication required", 401)

            const addresses = await this.addressService.getUserAddresses(req.user.id)

            res.json(addresses)
        } catch (error) {
            next(error)
        }
    }
    getAddresses: Handler = async (req, res, next) => {
        try {
            const addresses = await this.addressService.getAddresses()

            res.json(addresses)
        } catch (error) {
            next(error)
        }
    }
    getAddress: Handler = async (req, res, next) => {
        try {
            const { id } = req.params

            if (!id || typeof id !== "string") {
                throw new HttpError("Invalid id", 400)
            }

            const address = await this.addressService.getAddress(id)
            res.status(200).json(address)
        } catch (error) {
            next(error)
        }
    }
    updateAddress: Handler = async (req, res, next) => {
        try {
            if (!req.user) throw new HttpError("Authentication required", 401)

            req.body.userId = req.user.id

            const { id } = req.params

            if (!id || typeof id !== "string") {
                throw new HttpError("Invalid id", 400)
            }

            const data = updateAddressSchema.parse(req.body)

            const address = await this.addressService.updateAddress(id,data)
            res.status(200).json(address)
        } catch (error) {
            next(error)
        }
    }
    deleteAddress: Handler = async (req, res, next) => {
        try {
            if (!req.user) throw new HttpError("Authentication required", 401)
            const { id } = req.params

            if (!id || typeof id !== "string") {
                throw new HttpError("Invalid id", 400)
            }

            const address = await this.addressService.deleteAddress(id, req.user.id)
            res.status(200).json(address)
        } catch (error) {
            next(error)
        }
    }
}