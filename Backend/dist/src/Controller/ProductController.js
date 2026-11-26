import { createProductSchema, productQuerySchema, updateProductSchema, idParamSchema, slugParamSchema, productCategoryParamSchema, addCategoriesToProductSchema, addImagesToProductSchema, updateImagesFromProductSchema, } from "../Schema/ProductSchema.js";
import { HttpError } from "../Error/HttpError.js";
export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createProducts = async (req, res, next) => {
        const body = createProductSchema.parse(req.body);
        if (!req.files) {
            throw new HttpError("Erro ao receber imagens", 400);
        }
        const files = req.files;
        const response = await this.productService.createProduct(body, files);
        return res.status(201).json(response);
    };
    getProducts = async (req, res, next) => {
        const query = productQuerySchema.parse(req.query);
        const response = await this.productService.getProducts(query);
        return res.json(response);
    };
    getProductById = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const response = await this.productService.getProductById(id);
        return res.json(response);
    };
    getProductBySlug = async (req, res, next) => {
        const { slug } = slugParamSchema.parse(req.params);
        const response = await this.productService.getProductBySlug(slug);
        return res.json(response);
    };
    updateProduct = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const body = updateProductSchema.parse(req.body);
        const files = req.files;
        const response = await this.productService.updateProduct(id, body, files);
        return res.json(response);
    };
    deleteProduct = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const response = await this.productService.deleteProduct(id);
        return res.json(response);
    };
    addCategoriesToProduct = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const { categoryIds } = addCategoriesToProductSchema.parse(req.body);
        const response = await this.productService.addCategoriesToProduct(id, categoryIds);
        return res.status(201).json(response);
    };
    deleteCategoryFromProduct = async (req, res, next) => {
        const { productId, categoryId } = productCategoryParamSchema.parse(req.params);
        const response = await this.productService.deleteCategoryFromProduct(productId, categoryId);
        return res.json(response);
    };
    addImagesToProduct = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const images = addImagesToProductSchema.parse(req.body);
        const response = await this.productService.addImagesToProduct(id, images);
        return res.status(201).json(response);
    };
    deleteImagesFromProduct = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const response = await this.productService.deleteImagesFromProduct(id);
        return res.json(response);
    };
    updateImagesFromProduct = async (req, res, next) => {
        const images = updateImagesFromProductSchema.parse(req.body);
        const response = await this.productService.updateImagesFromProduct(images);
        return res.json(response);
    };
}
//# sourceMappingURL=ProductController.js.map