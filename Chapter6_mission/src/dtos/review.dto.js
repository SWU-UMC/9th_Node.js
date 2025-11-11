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

// 단일 리뷰 생성/조회
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

// 리뷰 목록 조회
export const responseFromReviews = (reviews) => {
  const data = reviews.map((r) => ({
    id: r.id,
    nickname: r.userMission.user.nickname,
    profileImage: r.userMission.user.profileImage,
    score: r.score,
    body: r.body,
    createdAt: r.createdAt,
  }));

  return {
    data,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};

// 내가 작성한 리뷰 목록 조회
export const responseFromUserReviews = (reviews) => {
  const formatted = reviews.map((r) => ({
    id: r.id,
    storeName: r.userMission.mission.store?.name || "알 수 없음",
    body: r.body,
    score: r.score,
    imageCount: r.imageCount,
    createdAt: r.createdAt,
  }));

  return {
    data: formatted,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};