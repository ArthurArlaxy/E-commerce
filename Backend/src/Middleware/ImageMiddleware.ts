import multer from "multer"

export const imageMiddleware = multer({dest: "./uploads"})