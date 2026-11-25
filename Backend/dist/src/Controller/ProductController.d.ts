import type { Handler } from "express";
import type { ProductService } from "../Service/ProductService.js";
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    createProducts: Handler;
    getProducts: Handler;
    getProductById: Handler;
    getProductBySlug: Handler;
    updateProduct: Handler;
    deleteProduct: Handler;
    addCategoriesToProduct: Handler;
    deleteCategoryFromProduct: Handler;
    addImagesToProduct: Handler;
    deleteImagesFromProduct: Handler;
    updateImagesFromProduct: Handler;
}
//# sourceMappingURL=ProductController.d.ts.map