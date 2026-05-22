import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import { router } from "./router.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api", router)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})