// src/dtos/review.dto.js

// 공통 에러 헬퍼
const createBadRequestError = (message, data = null) => {
  const err = new Error(message);
  err.statusCode = 400;
  err.errorCode = "unknown"; // 필요시 변경
  err.data = data;
  return err;
};

/**
 * 리뷰 생성용 DTO 변환 + 검증
 * @param {object} body - 요청 바디
 * @param {number} storeId - path param에서 온 store_id
 */
export const bodyToReview = (body, storeId) => {
  // storeId 검증
  if (!Number.isInteger(storeId) || storeId <= 0) {
    throw createBadRequestError("유효하지 않은 store_id 입니다.", {
      storeId,
    });
  }

  const { userMissionId, score, body: content, imageCount } = body;

  // userMissionId: 필수, 양의 정수
  if (
    userMissionId === undefined ||
    userMissionId === null ||
    !Number.isInteger(userMissionId) ||
    userMissionId <= 0
  ) {
    throw createBadRequestError(
      "userMissionId는 1 이상의 정수여야 합니다.",
      { userMissionId }
    );
  }

  // body: 필수, 비어있지 않은 문자열
  if (typeof content !== "string" || content.trim().length === 0) {
    throw createBadRequestError("body는 비어있지 않은 문자열이어야 합니다.", {
      body: content,
    });
  }

  // score: 필수, 1~5 사이 정수
  if (
    score === undefined ||
    score === null ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    throw createBadRequestError(
      "score는 1 이상 5 이하의 정수여야 합니다.",
      { score }
    );
  }

  // imageCount: 선택, 있으면 0 이상 정수
  let parsedImageCount = 0;
  if (imageCount !== undefined && imageCount !== null) {
    if (!Number.isInteger(imageCount) || imageCount < 0) {
      throw createBadRequestError(
        "imageCount는 0 이상의 정수여야 합니다.",
        { imageCount }
      );
    }
    parsedImageCount = imageCount;
  }

  // 실제 DB에 넣을 형태로 변환
  return {
    storeId,
    userMissionId,
    body: content.trim(),
    score,
    imageCount: parsedImageCount,
  };
};


// 단일 리뷰 생성/조회
export const responseFromReview = (review) => {
  if (!review) return null;
  return {
    id: review.id,
    userMissionId: review.userMissionId,
    body: review.body,
    score: review.score,
    imageCount: review.imageCount,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
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