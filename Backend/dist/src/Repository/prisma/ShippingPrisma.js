import { prisma } from "../../Database/index.js";
export class ShippingPrisma {
    constructor() { }
    async createShipping(data) {
        const shipping = await prisma.shipping.create({ data });
        return shipping;
    }
    async getShippings() {
        return await prisma.shipping.findMany();
    }
    async getShippingById(id) {
        return await prisma.shipping.findUnique({ where: { id } });
    }
    async updateShipping(id, data) {
        return await prisma.shipping.update({
            where: { id },
            data
        });
    }
    async deleteShipping(id) {
        return await prisma.shipping.delete({ where: { id } });
    }
}
//# sourceMappingURL=ShippingPrisma.js.map