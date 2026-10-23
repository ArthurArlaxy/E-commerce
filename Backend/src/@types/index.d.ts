import { JwtPayload } from "jsonwebtoken";
import type { SafeUserReturn } from "../Schema/UserSchema.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & SafeUserReturn
        }
    }
}

export {}