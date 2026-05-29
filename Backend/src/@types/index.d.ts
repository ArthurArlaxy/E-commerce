import { JwtPayload } from "jsonwebtoken";
import type { SafeUserReturn } from "../Schema/UserSchema.js";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & SafeUserReturn
        }
    }
}

export {}