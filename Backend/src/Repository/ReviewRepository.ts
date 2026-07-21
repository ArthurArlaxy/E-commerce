import type { Prisma, Review } from "@prisma/client";
import type { CreateReviewInput, UpdateReviewInput } from "../Schema/ReviewSchema.js";

export interface ReviewRepository {
    createReview(data: CreateReviewInput, userId: string, productId: string): Promise<Review>
    getReviews(filter: Prisma.ReviewWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: Review[], total: number }>
    getReviewById(id: string): Promise<Review | null>
    updateReview(id: string, data: UpdateReviewInput): Promise<Review>
    deleteReview(id: string): Promise<Review>
}