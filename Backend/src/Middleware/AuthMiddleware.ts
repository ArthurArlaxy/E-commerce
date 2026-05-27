import type { Handler } from "express"
import jwt from "jsonwebtoken"
import { HttpError } from "../Error/HttpError.js";

const SECRET_KEY  = process.env.SECRET_KEY 

export class AuthMiddleware {

    static authenticate: Handler = (req, res, next) => {
        const token = req.cookies.token
        
        if(!token){
            throw new HttpError("Unauthorized", 401);
        }

        if(!SECRET_KEY){
            throw new HttpError("internal errot", 500)
        }

        const response = jwt.verify(token, SECRET_KEY)

        req.user = response;
        next();
    }

    static admin: Handler = (req, res, next) => {
        if(!req.user ||(req.user as any).role !== "admin"){
            throw new HttpError("Unauthorized, Admin required", 401);
        }

        next();
    }
}