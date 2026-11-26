import { prisma } from "../../Database/index.js";
import { toUpdate } from "../../helpers/mappers.js";
import { email } from "zod";
export class UserPrisma {
    constructor() { }
    async getAllUsers() {
        return prisma.user.findMany();
    }
    async getUserByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email: email,
            }, select: {
                name: true,
                email: true,
                role: true,
                password: true
            }
        });
    }
    async getUserById(id) {
        return prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                email: true,
                role: true,
                password: true
            }
        });
    }
    async getUserByEmailWithAllInfo(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async createUser(data) {
        return prisma.user.create({
            data,
            select: {
                name: true,
                email: true,
                role: true,
            }
        });
    }
    async updateUser(id, data) {
        const formatedData = toUpdate(data);
        return prisma.user.update({
            where: { id },
            data: {
                name: formatedData.name,
                email: formatedData.email,
                password: formatedData.newPassword
            }
        });
    }
    deleteUser(id) {
        return prisma.user.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=UserPrisma.js.map