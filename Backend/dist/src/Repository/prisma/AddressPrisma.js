import { prisma } from "../../Database/index.js";
import { toCreate, toUpdate } from "../../helpers/mappers.js";
import { HttpError } from "../../Error/HttpError.js";
export class AddressPrisma {
    constructor() { }
    async createAddress(data) {
        return prisma.$transaction(async (transaction) => {
            const count = await transaction.address.count({
                where: { userId: data.userId }
            });
            if (count >= 3) {
                throw new HttpError("Limit address: 3", 400);
            }
            if (data.isPrimary) {
                await transaction.address.updateMany({
                    where: {
                        userId: data.userId,
                        isPrimary: true
                    },
                    data: { isPrimary: false }
                });
            }
            return transaction.address.create({
                data: toCreate(data)
            });
        });
    }
    async getUserAddresses(userId) {
        return prisma.address.findMany({
            where: { userId },
            orderBy: { street: "desc" }
        });
    }
    async getAllAddresses() {
        return prisma.address.findMany();
    }
    async getAddress(id) {
        return prisma.address.findUnique({ where: { id } });
    }
    async updateAddress(id, data) {
        return prisma.$transaction(async (transaction) => {
            if (data.isPrimary) {
                await transaction.address.updateMany({
                    where: {
                        userId: data.userId,
                        isPrimary: true
                    },
                    data: { isPrimary: false }
                });
            }
            return transaction.address.update({
                where: { id },
                data: toUpdate(data)
            });
        });
    }
    async deleteAddress(id) {
        return prisma.address.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=AddressPrisma.js.map