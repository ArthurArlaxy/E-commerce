import type { ReviewRepository } from "../Repository/ReviewRepository.js";
import type { CreateReviewInput, ReviewQueryInput, UpdateReviewInput } from "../Schema/ReviewSchema.js";
export declare class ReviewService {
    private reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    createReview(data: CreateReviewInput, userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
    }>;
    getReviews(query: ReviewQueryInput): Promise<{
        items: import(".prisma/client").Review[];
        total: number;
    }>;
    getReviewById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
    }>;
    updateReview(id: string, userId: string, data: UpdateReviewInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
    }>;
    deleteReview(id: string, userId: string, isAdmin: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
    }>;
}
//# sourceMappingURL=ReviewService.d.ts.map