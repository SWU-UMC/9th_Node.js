export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};

/**
 * 리뷰 생성을 위한 DTO
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Object} 검증된 리뷰 데이터
 */
export const createReviewDto = (reviewData) => {
  const { content, rating, userId, storeId } = reviewData;
  
  if (!content || typeof content !== 'string') {
    throw new Error('리뷰 내용은 필수입니다.');
  }
  
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('평점은 1부터 5 사이의 숫자여야 합니다.');
  }
  
  if (!userId || !storeId) {
    throw new Error('사용자 ID와 가게 ID는 필수입니다.');
  }
  
  return {
    content,
    rating: parseFloat(rating),
    userId: parseInt(userId),
    storeId: parseInt(storeId),
  };
};