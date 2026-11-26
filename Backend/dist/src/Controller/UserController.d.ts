import type { Handler } from "express";
import type { UserService } from "../Service/UserService.js";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    login: Handler;
    register: Handler;
    getAllUsers: Handler;
    getUserByEmail: Handler;
    getUserById: Handler;
    updateUser: Handler;
    deleteUser: Handler;
}
//# sourceMappingURL=UserController.d.ts.map