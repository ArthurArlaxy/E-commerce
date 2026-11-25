import { createShippingSchema, updateShippingSchema } from "../Schema/ShippingSchema.js";
import { HttpError } from "../Error/HttpError.js";
export class ShippingController {
    shippingService;
    constructor(shippingService) {
        this.shippingService = shippingService;
    }
    createShipping = async (req, res) => {
        const body = createShippingSchema.parse(req.body);
        const shipping = await this.shippingService.createShipping(body);
        return res.json(shipping).status(201);
    };
    getShippings = async (req, res) => {
        const shippings = await this.shippingService.getShippings();
        return res.json(shippings);
    };
    getShippindById = async (req, res) => {
        const id = String(req.params.id);
        if (!id) {
            throw new HttpError("Invalid ID", 400);
        }
        const shipping = await this.shippingService.getShippingById(id);
        return res.json(shipping);
    };
    updateShipping = async (req, res) => {
        const id = String(req.params.id);
        const body = updateShippingSchema.parse(req.body);
        if (!id) {
            throw new HttpError("Invalid ID", 400);
        }
        const updatedShipping = await this.shippingService.updateShipping(id, body);
        res.json(updatedShipping);
    };
    deleteShipping = async (req, res) => {
        const id = String(req.params.id);
        if (!id) {
            throw new HttpError("Invalid ID", 400);
        }
        const deletedShipping = await this.shippingService.deleteShipping(id);
    };
}
//# sourceMappingURL=ShippingController.js.map