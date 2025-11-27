// src/services/review.service.js
import {
  getStoreById,
  getUserMissionById,
  findReviewByUserMissionId,
  createReview,
  getAllStoreReviews,
  getUserReviews,
} from "../repositories/review.repository.js";

import {
  responseFromReview,
  responseFromReviews,
  responseFromUserReviews,
} from "../dtos/review.dto.js";

// 리뷰 등록
export const addReview = async (reviewData) => {
  const  {storeId, userMissionId } = reviewData;

  // 가게 존재 확인
  const store = await getStoreById(storeId);
  if (!store) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId });
  }

  // 유저 미션 존재 확인
  const userMission = await getUserMissionById(userMissionId);
  if (!userMission) {
    throw new MissionNotFoundError("미션 정보를 찾을 수 없습니다.", { userMissionId });
  }

  // 중복 리뷰 방지
  const existing = await findReviewByUserMissionId(userMissionId);
  if (existing) {
    throw new MissionAlreadyCompletedError(
      "이미 리뷰를 작성한 미션입니다.", { userMissionId });
  }

  // 리뷰 등록(생성)
  const review = await createReview(reviewData);
  return responseFromReview(review);
};

// 리뷰 목록 조회
export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

// 내가 작성한 리뷰 목록 조회
export const listUserReviews = async (userId, cursor) => {
  const reviews = await getUserReviews(userId, cursor);
  return responseFromUserReviews(reviews);
};