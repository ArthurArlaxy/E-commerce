import bcrypt from "bcrypt";
import { HttpError } from "../Error/HttpError.js";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
export class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(data) {
        const user = await this.userRepository.getUserByEmailWithAllInfo(data.email);
        if (!user || !bcrypt.compareSync(data.password, user.password)) {
            throw new HttpError("Invalid credentials", 401);
        }
        const response = { ...user, password: undefined, cratedAt: undefined, updatedAt: undefined };
        if (!SECRET_KEY) {
            throw new HttpError("internal error", 500);
        }
        const token = jwt.sign(response, SECRET_KEY, { expiresIn: "1d" });
        return token;
    }
    async createUser(data) {
        const userExists = await this.userRepository.getUserByEmailWithAllInfo(data.email);
        if (userExists) {
            throw new Error("User with this email already exists");
        }
        data.password = bcrypt.hashSync(data.password, 10);
        data.role = "client";
        try {
            const user = await this.userRepository.createUser(data);
            if (!SECRET_KEY || !user) {
                throw new HttpError("internal error", 500);
            }
            const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });
            return token;
        }
        catch (error) {
            throw new HttpError(`Failed to create user: ${error}`, 500);
        }
    }
    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new HttpError("User not found", 404);
        }
        return user;
    }
    async updateUser(email, data) {
        const userExists = await this.userRepository.getUserByEmailWithAllInfo(email);
        if (!userExists) {
            throw new HttpError("User not found", 404);
        }
        if (data.email) {
            const userEmailExist = await this.userRepository.getUserByEmail(data.email);
            if (userEmailExist) {
                throw new HttpError("You can't use this email", 400);
            }
        }
        if (!data.currentPassword) {
            throw new HttpError("Password is required to Update", 401);
        }
        if (!bcrypt.compareSync(data.currentPassword, userExists.password)) {
            throw new HttpError("Invalid password", 401);
        }
        if (data.newPassword) {
            data.newPassword = bcrypt.hashSync(data.newPassword, 10);
        }
        try {
            return this.userRepository.updateUser(userExists.id, data);
        }
        catch (error) {
            throw new HttpError(`Failed to update user: ${error}`, 500);
        }
    }
    async deleteUser(id) {
        try {
            return this.userRepository.deleteUser(id);
        }
        catch (error) {
            throw new HttpError(`Failed to delete user: ${error}`, 500);
        }
    }
}
//# sourceMappingURL=UserService.js.map