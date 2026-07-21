import { Prisma } from "@prisma/client";
import { HttpError } from "../Error/HttpError.js";
import type { ReviewRepository } from "../Repository/ReviewRepository.js";
import type { CreateReviewInput, ReviewQueryInput, UpdateReviewInput } from "../Schema/ReviewSchema.js";

export class ReviewService {
    constructor(private reviewRepository: ReviewRepository) { }

    async createReview(data: CreateReviewInput, userId: string, productId: string) {
        try {
            return await this.reviewRepository.createReview(data, userId, productId)
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw new HttpError("You have already reviewed this product", 409)
            }
            throw err
        }
    }

    async getReviews(query: ReviewQueryInput) {
        const filter: Prisma.ReviewWhereInput = {}

        if (query.productId) {
            filter.productId = query.productId
        }

        if (query.userId) {
            filter.userId = query.userId
        }

        if (query.rating) {
            filter.rating = query.rating
        }

        const take = query.limit ?? 20
        const skip = query.page ? (query.page - 1) * take : 0

        return await this.reviewRepository.getReviews(filter, query.orderBy ?? "createdAt", query.order ?? "desc", take, skip)
    }

    async getReviewById(id: string) {
        if (typeof id !== "string") {
            throw new HttpError("Invalid Review ID", 400)
        }

        const review = await this.reviewRepository.getReviewById(id)

        if (!review) {
            throw new HttpError("Review not found", 404)
        }

        return review
    }

    async updateReview(id: string, userId: string, data: UpdateReviewInput) {
        const review = await this.getReviewById(id)

        if (review.userId !== userId) {
            throw new HttpError("You can only update your own review", 403)
        }

        const updatedReview = await this.reviewRepository.updateReview(id, data)

        if (!updatedReview) {
            throw new HttpError("Error occurred while updating the review", 500)
        }

        return updatedReview
    }

    async deleteReview(id: string, userId: string, isAdmin: boolean) {
        const review = await this.getReviewById(id)

        if (review.userId !== userId && !isAdmin) {
            throw new HttpError("You can only delete your own review", 403)
        }

        const deletedReview = await this.reviewRepository.deleteReview(id)

        if (!deletedReview) {
            throw new HttpError("Error occurred while deleting the review", 500)
        }

        return deletedReview
    }
}