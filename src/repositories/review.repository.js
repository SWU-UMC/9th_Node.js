import { prisma } from '../db.config.js';

/**
 * 리뷰를 삽입
 */
export const createReview = async (userId, storeId, rating, content) => {
    const review = await prisma.review.create({
        data: {
            userId: parseInt(userId),
            storeId: parseInt(storeId),
            rating: parseFloat(rating),
            content: content
        }
    });
    return review.id;
};

/**
 * 가게의 리뷰 조회
 */
export const getStoreReviews = async (storeId, cursor) => {
    return await prisma.review.findMany({
        where: { 
            storeId: parseInt(storeId),
            ...(cursor && { id: { gt: parseInt(cursor) } })
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { id: 'asc' },
        take: 5
    });
};

/**
 * 리뷰 ID로 리뷰 조회
 */
export const findReviewById = async (reviewId) => {
    return await prisma.review.findUnique({
        where: { id: parseInt(reviewId) }
    });
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (reviewId) => {
    await prisma.review.delete({
        where: { id: parseInt(reviewId) }
    });
};