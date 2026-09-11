import type { User } from "@prisma/client";
import type { CreateUserInput, SafeUserReturn, UpdateUserInput } from "../Schema/UserSchema.js";
import type { JwtPayload } from "jsonwebtoken";

export interface UserRepository {
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<SafeUserReturn & { password: string} | null>;
    getUserById(id: string): Promise<SafeUserReturn | null>;
    getUserByEmailWithAllInfo(email:string): Promise<User | null>;
    createUser(data: CreateUserInput): Promise<JwtPayload>;
    updateUser(id: string, data: UpdateUserInput): Promise<User>;
    deleteUser(id: string): Promise<User>;
}