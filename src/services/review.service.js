import * as reviewRepository from '../repositories/review.repository.js';
import * as storeRepository from '../repositories/store.repository.js';

export const addReviewToStore = async (userId, storeId, reviewData) => {
    
    // 1. [필수 검증]: 가게 존재 여부 확인
    const storeExists = await storeRepository.findStoreById(storeId);
    if (!storeExists) {
        const error = new Error('존재하지 않는 가게입니다.');
        error.status = 404; // Not Found
        throw error;
    }

    // 2. 리뷰 삽입
    const reviewId = await reviewRepository.createReview(
        userId, 
        storeId, 
        reviewData.rating, 
        reviewData.content
    );

    // 3. 가게 평점 업데이트
    await storeRepository.updateStoreRating(storeId);
    
    return { reviewId: reviewId, message: '리뷰가 성공적으로 작성되었습니다.' };
};