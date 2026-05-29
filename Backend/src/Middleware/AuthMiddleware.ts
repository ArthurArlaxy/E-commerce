import type { Handler } from "express"
import jwt from "jsonwebtoken"
import { HttpError } from "../Error/HttpError.js"
import type { SafeUserReturn } from "../Schema/UserSchema.js"

const SECRET_KEY = process.env.SECRET_KEY

export class AuthMiddleware {

    static authenticate: Handler = (req, res, next) => {
        try {
            const token = req.cookies.token

            if (!token) throw new HttpError("Unauthorized", 401)
            if (!SECRET_KEY) throw new HttpError("Internal error", 500)

            req.user = jwt.verify(token, SECRET_KEY) as SafeUserReturn

            next()
        } catch (error) {
            next(error)
        }
    }

    static admin: Handler = (req, res, next) => {
        if (!req.user || req.user.role !== "admin") {
            throw new HttpError("Unauthorized, Admin required", 401)
        }

        next()
    }
}