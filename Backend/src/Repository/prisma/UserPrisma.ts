import type { Role, User } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { CreateUserInput, SafeUserReturn, UpdateUserInput } from "../../Schema/UserSchema.js";

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
        const update = {
        ...(data.name !== undefined && { name: data.name }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.password !== undefined && { password: data.password }),
        };

        return prisma.user.update({
            where: { id },
            data: { update }
        });
    }

    deleteUser(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}