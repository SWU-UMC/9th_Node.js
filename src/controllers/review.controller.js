import * as reviewService from '../services/review.service.js';

/**
 * POST /api/v1/stores/{storeId}/reviews 엔드포인트 핸들러
 */
export const addReview = async (req, res) => {
    // URL 경로에서 storeId 획득
    const storeId = parseInt(req.params.storeId); 
    // 인증된 사용자 ID 사용
    const userId = req.user.id;
    const { rating, content } = req.body;

    if (!rating || !content) {
        return res.status(400).json({ message: '평점과 리뷰 내용을 모두 입력해야 합니다.' });
    }

    try {
        const result = await reviewService.addReviewToStore(userId, storeId, { rating, content });
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ message: error.message || '리뷰 작성 중 오류 발생' });
    }
};