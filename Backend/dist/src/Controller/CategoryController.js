import { createCategorySchema, updateCategorySchema } from "../Schema/CategorySchema.js";
import { HttpError } from "../Error/HttpError.js";
import { file } from "zod";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    createCategory = async (req, res, next) => {
        try {
            const data = createCategorySchema.parse(req.body);
            const files = req.files;
            const category = await this.categoryService.createCategory(data, files);
            res.status(201).json(category);
        }
        catch (error) {
            next(error);
        }
    };
    getCategories = async (req, res, next) => {
        try {
            const categories = await this.categoryService.getCategories();
            res.json(categories);
        }
        catch (error) {
            next(error);
        }
    };
    getCategoryById = async (req, res, next) => {
        try {
            if (!req.params.id)
                throw new HttpError("Invalid id", 400);
            const id = String(req.params.id);
            const category = await this.categoryService.getCategoryById(id);
            res.json(category);
        }
        catch (error) {
            next(error);
        }
    };
    getCategoryBySlug = async (req, res, next) => {
        try {
            if (!req.params.slug)
                throw new HttpError("Invalid slug", 400);
            const slug = String(req.params.slug);
            const category = await this.categoryService.getCategoryBySlug(slug);
            res.json(category);
        }
        catch (error) {
            next(error);
        }
    };
    updateCategory = async (req, res, next) => {
        try {
            if (!req.params.id)
                throw new HttpError("Invalid id", 401);
            const id = String(req.params.id);
            const data = updateCategorySchema.parse(req.body);
            const files = req.files;
            const category = await this.categoryService.updateCategory(id, data, files);
            res.json(category);
        }
        catch (error) {
            next(error);
        }
    };
    deleteCategory = async (req, res, next) => {
        try {
            if (!req.params.id)
                throw new HttpError("Invalid id", 401);
            const id = String(req.params.id);
            await this.categoryService.deleteCategory(id);
            res.status(204).json("Category deleted Succesfully");
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=CategoryController.js.map