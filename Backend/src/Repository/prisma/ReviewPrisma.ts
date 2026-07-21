import type { Prisma, Review } from "@prisma/client";
import { prisma } from "../../Database/index.js";
import type { CreateReviewInput, UpdateReviewInput } from "../../Schema/ReviewSchema.js";

export class ReviewPrisma {
    constructor() { }

    async createReview(data: CreateReviewInput, userId: string, productId: string): Promise<Review> {
        return prisma.review.create({
            data: {
                ...data,
                userId,
                productId
            }
        })
    }

    async getReviews(filter: Prisma.ReviewWhereInput, orderBy: string, order: string, take: number, skip: number): Promise<{ items: Review[], total: number }> {
        const [items, total] = await prisma.$transaction([
            prisma.review.findMany({
                where: filter,
                orderBy: { [orderBy]: order },
                skip,
                take
            }),
            prisma.review.count({ where: filter })
        ])

        return { items, total }
    }

    async getReviewById(id: string): Promise<Review | null> {
        return await prisma.review.findUnique({
            where: { id }
        })
    }

    async updateReview(id: string, data: UpdateReviewInput): Promise<Review> {
        return await prisma.review.update({
            where: { id },
            data
        })
    }

    async deleteReview(id: string): Promise<Review> {
        return await prisma.review.delete({
            where: { id }
        })
    }
}