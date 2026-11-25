import { prisma } from "../../Database/index.js";
export class ReviewPrisma {
    constructor() { }
    async createReview(data, userId, productId) {
        return prisma.review.create({
            data: {
                ...data,
                userId,
                productId
            }
        });
    }
    async getReviews(filter, orderBy, order, take, skip) {
        const [items, total] = await prisma.$transaction([
            prisma.review.findMany({
                where: filter,
                orderBy: { [orderBy]: order },
                skip,
                take
            }),
            prisma.review.count({ where: filter })
        ]);
        return { items, total };
    }
    async getReviewById(id) {
        return await prisma.review.findUnique({
            where: { id }
        });
    }
    async updateReview(id, data) {
        return await prisma.review.update({
            where: { id },
            data
        });
    }
    async deleteReview(id) {
        return await prisma.review.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=ReviewPrisma.js.map