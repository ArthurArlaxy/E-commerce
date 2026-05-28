import type { User } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { CreateUserInput, SafeUserReturn, UpdateUserInput } from "../../Schema/UserSchema.js";
import { Mapper } from "../../helpers/mappers.js";
import { da } from "zod/locales";

export class UserPrisma {
    constructor() { }

    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async createUser(data: CreateUserInput): Promise<SafeUserReturn> {
        return prisma.user.create({
            data,
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
    }


    async updateUser(id: string, data: UpdateUserInput): Promise<User> {

        return prisma.user.update({
            where: { id },
            data: Mapper.toUpdate(data)
        });
    }

    deleteUser(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}