import type { User } from "@prisma/client";
import type { CreateUserInput, SafeUserReturn, UpdateUserInput } from "../../Schema/UserSchema.js";
export declare class UserPrisma {
    constructor();
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<SafeUserReturn & {
        password: string;
    } | null>;
    getUserById(id: string): Promise<SafeUserReturn | null>;
    getUserByEmailWithAllInfo(email: string): Promise<User | null>;
    createUser(data: CreateUserInput): Promise<SafeUserReturn>;
    updateUser(id: string, data: UpdateUserInput): Promise<User>;
    deleteUser(id: string): Promise<User>;
}
//# sourceMappingURL=UserPrisma.d.ts.map