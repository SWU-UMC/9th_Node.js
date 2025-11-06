import { prisma } from '../db.config.js';

console.log('Prisma in store.repository:', !!prisma ? 'Initialized' : 'Not initialized');

/**
 * 새로운 가게 정보를 DB에 삽입.
 */
export const createStore = async (name, address, region) => {
    const store = await prisma.store.create({
        data: {
            name,
            address,
            region
        }
    });
    return store.id;
};

/**
 * 가게 ID로 가게 존재 여부를 확인.
 */
export const findStoreById = async (storeId) => {
    const store = await prisma.store.findUnique({
        where: { id: parseInt(storeId) },
        select: { id: true }
    });
    return store !== null;
};

/**
 * 가게의 평균 평점을 업데이트.
 */
export const updateStoreRating = async (storeId) => {
    // 리뷰의 평균 평점 계산
    const avgRating = await prisma.storeReview.aggregate({
        where: { storeId: parseInt(storeId) },
        _avg: {
            rating: true
        }
    });

    // 가게 평점 업데이트
    await prisma.store.update({
        where: { id: parseInt(storeId) },
        data: {
            rating: avgRating._avg.rating || 0  // 리뷰가 없을 경우 0으로 설정
        }
    });
};

/**
 * 가게 리뷰 조회
 */
export const getAllStoreReviews = async (storeId, cursor) => {
    const reviews = await prisma.storeReview.findMany({
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
            },
            store: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { id: 'asc' },
        take: 5
    });

    return reviews;
};

/**
 * 가게 리뷰 생성
 */
export const createStoreReview = async (reviewData) => {
    const { content, rating, userId, storeId } = reviewData;
    
    // 트랜잭션을 사용하여 리뷰 생성과 가게 평점 업데이트를 함께 처리
    return await prisma.$transaction(async (tx) => {
        // 리뷰 생성
        const review = await tx.storeReview.create({
            data: {
                content,
                rating,
                userId,
                storeId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // 가게 평점 업데이트
        await updateStoreRating(storeId);

        return review;
    });
};