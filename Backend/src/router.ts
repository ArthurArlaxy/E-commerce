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
import { ProductPrisma } from "./Repository/prisma/ProductPrisma.js";
import { ProductService } from "./Service/ProductService.js";
import { ProductController } from "./Controller/ProductController.js";
import { ReviewPrisma } from "./Repository/prisma/ReviewPrisma.js";
import { ReviewService } from "./Service/ReviewService.js";
import { ReviewController } from "./Controller/ReviewController.js";

export const router = Router()

// Instancias do repository Prisma
const userPrisma = new UserPrisma()
const addressPrisma = new AddressPrisma()
const categoryPrisma = new CategoryPrisma()
const productPrisma = new ProductPrisma()
const reviewPrisma = new ReviewPrisma()

// Instancias do Service
const userService = new UserService(userPrisma)
const addressService = new AddressService(addressPrisma)
const categoryService = new CategoryService(categoryPrisma)
const productService = new ProductService(productPrisma)
const reviewService = new ReviewService(reviewPrisma)

// Instancias do Controller
const userController = new UserController(userService)
const addressController = new AddressController(addressService)
const categoryController = new CategoryController(categoryService)
const productController = new ProductController(productService)
const reviewController = new ReviewController(reviewService)

// Rotas de Autenticação
router.post("/register", userController.register)
router.post("/login", userController.login)

// Rotas de Usuários
router.get("/users", AuthMiddleware.authenticate, AuthMiddleware.admin, userController.getAllUsers)
router.get("/users/me", AuthMiddleware.authenticate, userController.getUserByEmail)
router.get("/users/:id", AuthMiddleware.authenticate, userController.getUserById)
router.put("/users/me", AuthMiddleware.authenticate, userController.updateUser)
router.delete("/users/me", AuthMiddleware.authenticate, userController.deleteUser)

// Rotas de Endereços
router.get("/addresses/all", AuthMiddleware.authenticate, AuthMiddleware.admin, addressController.getAllAddresses)
router.get("/addresses", AuthMiddleware.authenticate, addressController.getUserAddresses)
router.get("/addresses/:id", AuthMiddleware.authenticate, addressController.getAddress)
router.post("/addresses", AuthMiddleware.authenticate, addressController.createAddress)
router.put("/addresses/:id", AuthMiddleware.authenticate, addressController.updateAddress)
router.delete("/addresses/:id", AuthMiddleware.authenticate, addressController.deleteAddress)

// Rotas de Categorias
router.get("/categories", AuthMiddleware.authenticate, categoryController.getCategories)
router.get("/categories/id/:id", AuthMiddleware.authenticate, categoryController.getCategoryById)
router.get("/categories/:slug", AuthMiddleware.authenticate, categoryController.getCategoryBySlug)
router.post("/categories", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.createCategory)
router.put("/categories/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.updateCategory)
router.delete("/categories/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, categoryController.deleteCategory)

// Rotas de Produtos
router.get("/products", AuthMiddleware.authenticate, productController.getProducts)
router.get("/products/id/:id", AuthMiddleware.authenticate, productController.getProductById)
router.get("/products/:slug", AuthMiddleware.authenticate, productController.getProductBySlug)
router.post("/products", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.createProducts)
router.put("/products/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.updateProduct)
router.delete("/products/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.deleteProduct)
router.post("/products/:id/categories", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.addCategoriesToProduct)
router.delete("/products/:productId/categories/:categoryId", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.deleteCategoryFromProduct)
router.post("/products/:id/images", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.addImagesToProduct)
router.put("/products/images", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.updateImagesFromProduct)
router.delete("/products/images/:id", AuthMiddleware.authenticate, AuthMiddleware.admin, productController.deleteImagesFromProduct)

// Rotas de Reviews
router.get("/reviews", AuthMiddleware.authenticate, reviewController.getReviews)
router.get("/reviews/:id", AuthMiddleware.authenticate, reviewController.getReviewById)
router.post("/products/:productId/reviews", AuthMiddleware.authenticate, reviewController.createReview)
router.put("/reviews/:id", AuthMiddleware.authenticate, reviewController.updateReview)
router.delete("/reviews/:id", AuthMiddleware.authenticate, reviewController.deleteReview)