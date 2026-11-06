import multer from "multer"
import { HttpError } from "../Error/HttpError.js"

export const imageMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por arquivo
    fileFilter: (_req, file, callBack) => {
        if (!file.mimetype.startsWith("image/")) {
            return callBack(new HttpError("Apenas imagens são aceitas", 400))
        }
        callBack(null, true)
    }
})