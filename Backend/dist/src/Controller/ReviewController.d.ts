import type { Handler } from "express";
import type { ReviewService } from "../Service/ReviewService.js";
export declare class ReviewController {
    private reviewService;
    constructor(reviewService: ReviewService);
    createReview: Handler;
    getReviews: Handler;
    getReviewById: Handler;
    updateReview: Handler;
    deleteReview: Handler;
}
//# sourceMappingURL=ReviewController.d.ts.map