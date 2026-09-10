import type { Handler } from "express";
import { createShippingSchema, updateShippingSchema } from "../Schema/ShippingSchema.js";
import type { ShippingService } from "../Service/ShippingService.js";
import { HttpError } from "../Error/HttpError.js";

export class ShippingController {
    constructor(private shippingService: ShippingService) { }

    createShipping: Handler = async (req, res) => {
        const body = createShippingSchema.parse(req.body)

        const shipping = await this.shippingService.createShipping(body)

        return res.json(shipping).status(201)
    }

    getShippings: Handler = async (req, res) => {
        const shippings = await this.shippingService.getShippings()

        return res.json(shippings)
    }

    getShippindById: Handler = async (req, res) => {
        const id = String(req.params.id)

        if (!id) {
            throw new HttpError("Invalid ID", 400)
        }

        const shipping = await this.shippingService.getShippingById(id)

        return res.json(shipping)
    }

    updateShipping: Handler = async (req, res) => {
        const id = String(req.params.id)
        const body = updateShippingSchema.parse(req.body)

        if (!id) {
            throw new HttpError("Invalid ID", 400)
        }

        const updatedShipping = await this.shippingService.updateShipping(id, body)

        res.json(updatedShipping)
    }

    deleteShipping: Handler = async (req, res) => {
        const id = String(req.params.id)

        if (!id) {
            throw new HttpError("Invalid ID", 400)
        }

        const deletedShipping = await this.shippingService.deleteShipping(id)
    }
}