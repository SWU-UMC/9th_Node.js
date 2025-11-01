// src/dtos/review.dto.js

export const bodyToReview = (body, storeId) => {
  return {
    storeId,                     // URL 경로 파라미터
    userMissionId: body.userMissionId,  // 미션 ID (필수)
    body: body.body,             // 리뷰 내용
    score: body.score,           // 평점 (1~5)
    imageCount: body.imageCount || 0,  // 이미지 개수 (기본 0)
  };
};

export const responseFromReview = (review) => {
  if (!review) return null;
  return {
    id: review.id,
    storeId: review.store_id,
    userMissionId: review.user_mission_id,
    body: review.body,
    score: review.score,
    imageCount: review.image_count,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
  };
};