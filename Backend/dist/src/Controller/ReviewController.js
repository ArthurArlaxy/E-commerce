import { createReviewSchema, updateReviewSchema, reviewQuerySchema, idParamSchema, productIdParamSchema } from "../Schema/ReviewSchema.js";
import { HttpError } from "../Error/HttpError.js";
export class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    createReview = async (req, res, next) => {
        const { productId } = productIdParamSchema.parse(req.params);
        const body = createReviewSchema.parse(req.body);
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401);
        }
        const userId = req.user.id;
        console.log(body, userId, productId);
        const response = await this.reviewService.createReview(body, userId, productId);
        return res.status(201).json(response);
    };
    getReviews = async (req, res, next) => {
        const query = reviewQuerySchema.parse(req.query);
        const response = await this.reviewService.getReviews(query);
        return res.json(response);
    };
    getReviewById = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const response = await this.reviewService.getReviewById(id);
        return res.json(response);
    };
    updateReview = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        const body = updateReviewSchema.parse(req.body);
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401);
        }
        const userId = req.user.id;
        const response = await this.reviewService.updateReview(id, userId, body);
        return res.json(response);
    };
    deleteReview = async (req, res, next) => {
        const { id } = idParamSchema.parse(req.params);
        if (!req.user) {
            throw new HttpError("Not Authenticated", 401);
        }
        const userId = req.user.id;
        const isAdmin = req.user.role === "admin";
        const response = await this.reviewService.deleteReview(id, userId, isAdmin);
        return res.json(response);
    };
}
//# sourceMappingURL=ReviewController.js.map