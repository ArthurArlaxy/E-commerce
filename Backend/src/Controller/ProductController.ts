import type { Handler } from "express";
import type { ProductService } from "../Service/ProductService.js";
import {
    createProductSchema,
    productQuerySchema,
    updateProductSchema,
    idParamSchema,
    slugParamSchema,
    productCategoryParamSchema,
    addCategoriesToProductSchema,
    addImagesToProductSchema,
    updateImagesFromProductSchema,
} from "../Schema/ProductSchema.js";

export class ProductController {
    constructor(private productService: ProductService) { }

    createProducts: Handler = async (req, res, next) => {
        const body = createProductSchema.parse(req.body)

        const response = await this.productService.createProduct(body)

        return res.status(201).json(response)
    }

    getProducts: Handler = async (req, res, next) => {
        const query = productQuerySchema.parse(req.query)

        const response = await this.productService.getProducts(query)

        return res.json(response)
    }

    getProductById: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)

        const response = await this.productService.getProductById(id)

        return res.json(response)
    }

    getProductBySlug: Handler = async (req, res, next) => {
        const { slug } = slugParamSchema.parse(req.params)

        const response = await this.productService.getProductBySlug(slug)

        return res.json(response)
    }

    updateProduct: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)
        const body = updateProductSchema.parse(req.body)

        const response = await this.productService.updateProduct(id, body)

        return res.json(response)
    }

    deleteProduct: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)

        const response = await this.productService.deleteProduct(id)

        return res.json(response)
    }

    addCategoriesToProduct: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)
        const { categoryIds } = addCategoriesToProductSchema.parse(req.body)

        const response = await this.productService.addCategoriesToProduct(id, categoryIds)

        return res.status(201).json(response)
    }

    deleteCategoryFromProduct: Handler = async (req, res, next) => {
        const { productId, categoryId } = productCategoryParamSchema.parse(req.params)

        const response = await this.productService.deleteCategoryFromProduct(productId, categoryId)

        return res.json(response)
    }

    addImagesToProduct: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)
        const images = addImagesToProductSchema.parse(req.body)

        const response = await this.productService.addImagesToProduct(id, images)

        return res.status(201).json(response)
    }

    deleteImagesFromProduct: Handler = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params)

        const response = await this.productService.deleteImagesFromProduct(id)

        return res.json(response)
    }

    updateImagesFromProduct: Handler = async (req, res, next) => {
        const images = updateImagesFromProductSchema.parse(req.body)

        const response = await this.productService.updateImagesFromProduct(images)

        return res.json(response)
    }
}