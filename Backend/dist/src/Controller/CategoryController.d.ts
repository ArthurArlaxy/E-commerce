import type { Handler } from "express";
import type { CategoryService } from "../Service/CategoryService.js";
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    createCategory: Handler;
    getCategories: Handler;
    getCategoryById: Handler;
    getCategoryBySlug: Handler;
    updateCategory: Handler;
    deleteCategory: Handler;
}
//# sourceMappingURL=CategoryController.d.ts.map