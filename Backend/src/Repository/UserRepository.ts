import type { User } from "@prisma/client";
import type { CreateUserInput, UpdateUserInput } from "../Schema/UserSchema.js";
import type { JwtPayload } from "jsonwebtoken";

export interface UserRepository {
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    createUser(data: CreateUserInput): Promise<JwtPayload>;
    updateUser(id: string, data: UpdateUserInput): Promise<User>;
    deleteUser(id: string): Promise<User>;
}