import type { User } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { CreateUserInput, SafeUserReturn, UpdateUserInput } from "../../Schema/UserSchema.js";
import { toUpdate } from "../../helpers/mappers.js";
import { email } from "zod";


export class UserPrisma {
    constructor() { }

    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async getUserByEmail(email: string): Promise<SafeUserReturn & { password: string} | null> {
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

    async getUserById(id: string): Promise<SafeUserReturn | null> {
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

    async getUserByEmailWithAllInfo(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async createUser(data: CreateUserInput): Promise<SafeUserReturn> {
        return prisma.user.create({
            data,
            select: {
                name: true,
                email: true,
                role: true,
            }
        });
    }


    async updateUser(id: string, data: UpdateUserInput): Promise<User> {

        const formatedData = toUpdate(data)

        return prisma.user.update({
            where: { id },
            data: {
                name: formatedData.name,
                email: formatedData.email,
                password: formatedData.newPassword
            }
        });
    }

    deleteUser(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}