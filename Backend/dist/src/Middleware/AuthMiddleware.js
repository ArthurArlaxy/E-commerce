import jwt from "jsonwebtoken";
import { HttpError } from "../Error/HttpError.js";
const SECRET_KEY = process.env.SECRET_KEY;
export class AuthMiddleware {
    static authenticate = (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token)
                throw new HttpError("Unauthorized", 401);
            if (!SECRET_KEY)
                throw new HttpError("Internal error", 500);
            req.user = jwt.verify(token, SECRET_KEY);
            next();
        }
        catch (error) {
            next(error);
        }
    };
    static admin = (req, res, next) => {
        if (!req.user || req.user.role !== "admin") {
            throw new HttpError("Unauthorized, Admin required", 401);
        }
        next();
    };
}
//# sourceMappingURL=AuthMiddleware.js.map