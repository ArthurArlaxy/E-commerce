import { Router } from "express";
import { UserController } from "./Controller/UserController.js";
import { UserService } from "./Service/UserService.js";
import { UserPrisma } from "./Repository/prisma/UserPrisma.js";
import { AddressPrisma } from "./Repository/prisma/AddressPrisma.js"
import { AuthMiddleware } from "./Middleware/AuthMiddleware.js";
import { AddressService } from "./Service/AddressService.js";
import { AddressController } from "./Controller/AddressController.js";
import { CategoryPrisma } from "./Repository/prisma/CategoryPrisma.js";
import { CategoryService } from "./Service/CategoryService.js";
import { CategoryController } from "./Controller/CategoryController.js";

export const router = Router()

// Instancias do repository Prisma
const userPrisma = new UserPrisma()
const addressPrisma = new AddressPrisma()
const categoryPrisma = new CategoryPrisma()

// Instancias do Service
const userService = new UserService(userPrisma)
const addressService = new AddressService(addressPrisma)
const categoryService = new CategoryService(categoryPrisma)

// Instancias do Controller
const userController = new UserController(userService)
const addressController = new AddressController(addressService)
const categoryController = new CategoryController(categoryService)

//Rotas de Authenticação
router.post("/register", userController.register)
router.post("/login", userController.login)

//Rotas protegidas port authenticação
router.get("/allusers", AuthMiddleware.authenticate, AuthMiddleware.admin, userController.getAllUsers )
router.get("/user", AuthMiddleware.authenticate, userController.getUserByEmail)
router.get("/user/:id", AuthMiddleware.authenticate, userController.getUserById)
router.put("/user", AuthMiddleware.authenticate, userController.updateUser)
router.delete("/user", AuthMiddleware.authenticate, userController.deleteUser)

router.get("/alladdresses", AuthMiddleware.authenticate, AuthMiddleware.admin, addressController.getAllAddresses)
router.get("/addresses", AuthMiddleware.authenticate, addressController.getUserAddresses)
router.get("/address/:id", AuthMiddleware.authenticate, addressController.getAddress)
router.post("/address", AuthMiddleware.authenticate, addressController.createAddress)
router.put("/address/:id", AuthMiddleware.authenticate, addressController.updateAddress)
router.delete("/address/:id", AuthMiddleware.authenticate, addressController.deleteAddress)

router.get("/allcategories", AuthMiddleware.authenticate, categoryController.getCategories)
router.get("/category/id/:id", AuthMiddleware.authenticate, categoryController.getCategoryById)
router.get("/category/:slug", AuthMiddleware.authenticate, categoryController.getCategoryBySlug)
router.post("/category", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.createCategory)
router.put("/category/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.updateCategory)
router.delete("/category/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.deleteCategory)