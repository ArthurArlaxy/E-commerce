import type { Handler } from "express";
import { createUserSchema, loginSchema, updateUserSchema } from "../Schema/UserSchema.js";
import type { UserService } from "../Service/UserService.js";
import { HttpError } from "../Error/HttpError.js";

export class UserController {
    constructor(private  userService: UserService) { }

    login: Handler = async (req, res, next) => {
        const data = loginSchema.parse(req.body);

        try {
            const response = await this.userService.login(data);

            res.cookie("token", response, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })

            return res.status(201).json({ message: "Login sucessfuly" })
        } catch (error) {
            next(error)
        }
    }

    register: Handler = async (req, res, next) => {
        const data = createUserSchema.parse(req.body);
        try {

            const response = await this.userService.createUser(data);

            res.cookie("token", response, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })

            return res.status(201).json({ message: "Register sucessfuly" })

        } catch (error) {
            next(error)
        }
    }

    getAllUsers: Handler = async (req, res, next) => {
        try {
            const users = await this.userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            next(error)
        }
    }

    getUserByEmail: Handler = async (req, res, next) => {
        7
        if (!req.user) throw new HttpError("Invalid token", 401)

        try {
            const user = await this.userService.getUserByEmail((req.user as any).email);
            return res.json(user);
        } catch (error) {
            next(error)
        }
    }
    getUserById: Handler = async (req, res, next) => {
        if (!req.params.id) throw new HttpError("Invalid id", 401)
        const id = String(req.params.id)

        try {
            const user = await this.userService.getUserById(id);
            return res.json(user);
        } catch (error) {
            next(error)
        }
    }

    updateUser: Handler = async (req, res, next) => {
        if (!req.user) throw new HttpError("Invalid token", 401)

        const data = updateUserSchema.parse(req.body)

        try {
            const updatedUser = await this.userService.updateUser((req.user as any).id, data)
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }


    deleteUser: Handler = async (req, res, next) => {
        if (!req.user) throw new HttpError("Invalid token", 401)

        try {
            await this.userService.deleteUser((req.user as any).id)
            res.status(200).json("User deleted sussecsfuly")
        } catch (error) {
            next(error)
        }
    }
}