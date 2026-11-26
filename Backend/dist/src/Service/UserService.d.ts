import type { UserRepository } from "../Repository/UserRepository.js";
import type { CreateUserInput, LoginUserInput, UpdateUserInput } from "../Schema/UserSchema.js";
export declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    login(data: LoginUserInput): Promise<string>;
    createUser(data: CreateUserInput): Promise<string>;
    getAllUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserByEmail(email: string): Promise<{
        name: string;
        email: string;
        role: "admin" | "client" | "manager";
    } & {
        password: string;
    }>;
    getUserById(id: string): Promise<{
        name: string;
        email: string;
        role: "admin" | "client" | "manager";
    }>;
    updateUser(email: string, data: UpdateUserInput): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=UserService.d.ts.map