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
 * @param {number|string} storeId - 가게 ID
 * @param {import('@prisma/client').Prisma.TransactionClient} [tx] - 트랜잭션 클라이언트 (선택사항)
 * @returns {Promise<{averageRating: number, reviewCount: number}>} 업데이트된 평점 정보
 */
export const updateStoreRating = async (storeId, tx = prisma) => {
    try {
        console.log(`Updating rating for store ${storeId}`);
        
        // 해당 가게의 모든 리뷰의 평점 평균 계산
        const result = await tx.storeReview.aggregate({
            where: { 
                storeId: typeof storeId === 'string' ? parseInt(storeId) : storeId 
            },
            _avg: { rating: true },
            _count: true
        });

        const averageRating = result._avg.rating || 0;
        const reviewCount = result._count;

        console.log(`New rating for store ${storeId}:`, { averageRating, reviewCount });

        // 가게 평점 업데이트 (별도 트랜잭션으로 처리)
        await prisma.store.update({
            where: { id: parseInt(storeId) },
            data: {
                rating: averageRating,
                reviewCount
            }
        });
        
        console.log(`Successfully updated rating for store ${storeId}`);
        
    } catch (error) {
        console.error(`Failed to update rating for store ${storeId}:`, error);
        // 에러를 던지지 않고 로그만 남기고 계속 진행
    }
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
/**
 * 가게 리뷰 생성 (트랜잭션 없이 단순 생성)
 */
/**
 * 가게의 미션 목록 조회
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Array>} 미션 목록
 */
export const getStoreMissions = async (storeId) => {
    try {
        const missions = await prisma.mission.findMany({
            where: {
                storeId: parseInt(storeId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return missions;
    } catch (error) {
        console.error('Error getting store missions:', error);
        throw error;
    }
};

export const createStoreReview = async (reviewData) => {
    const { content, rating, userId, storeId } = reviewData;
    
    try {
        console.log('Creating review with data:', { content, rating, userId, storeId });
        
        // 1. 리뷰 생성 (트랜잭션 없이)
        const review = await prisma.storeReview.create({
            data: {
                content: String(content),
                rating: parseFloat(rating),
                userId: parseInt(userId),
                storeId: parseInt(storeId)
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

        console.log('Review created successfully:', review);

        // 2. 가게 평점 업데이트 (별도 트랜잭션으로 처리)
        try {
            await updateStoreRating(storeId);
        } catch (updateError) {
            console.error('Failed to update store rating (non-blocking):', updateError);
            // 평점 업데이트 실패해도 리뷰는 성공한 것으로 간주
        }

        return review;
        
    } catch (error) {
        console.error('Failed to create store review:', error);
        
        // 중복 리뷰 체크
        if (error.code === 'P2002') {
            throw new Error('이미 이 가게에 리뷰를 작성하셨습니다.');
        }
        
        // 외래 키 제약 조건 오류
        if (error.code === 'P2003') {
            if (error.meta?.field_name?.includes('userId')) {
                throw new Error('유효하지 않은 사용자 ID입니다.');
            } else if (error.meta?.field_name?.includes('storeId')) {
                throw new Error('유효하지 않은 가게 ID입니다.');
            }
        }
        
        // 트랜잭션 타임아웃 오류
        if (error.code === 'P2028') {
            throw new Error('요청이 시간 초과되었습니다. 잠시 후 다시 시도해주세요.');
        }
        
        throw new Error('리뷰 등록 중 오류가 발생했습니다.');
    }
};