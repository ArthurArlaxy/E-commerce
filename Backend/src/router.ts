import { Router } from "express";
import { UserController } from "./Controller/UserController.js";
import { UserService } from "./Service/UserService.js";
import { UserPrisma } from "./Repository/prisma/UserPrisma.js";
import { AuthMiddleware } from "./Middleware/AuthMiddleware.js";

export const router = Router()

// Instancias do repository Prisma
const userPrisma = new UserPrisma()

// Instancias do Service
const userService = new UserService(userPrisma)

// Instancias do Controller
const userController = new UserController(userService)

//Rotas de Authenticação
router.post("/register", userController.register)
router.post("/login", userController.login)

//Rotas protegidas port authenticação
router.get("/allusers", AuthMiddleware.authenticate, AuthMiddleware.admin, userController.getAllUsers )
router.get("/user", AuthMiddleware.authenticate, userController.getUserByEmail)
router.get("/user/:id", AuthMiddleware.authenticate, userController.getUserById)
router.put("/user", AuthMiddleware.authenticate, userController.updateUser)
router.delete("/user", AuthMiddleware.authenticate, userController.deleteUser)