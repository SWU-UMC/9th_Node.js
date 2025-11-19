// src/services/review.service.js
import {
  getStoreById,
  getUserMissionById,
  findRiviewByUserMissionId,
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
    // 커스텀 에러 처리 구현
  }

  // 유저 미션 존재 확인
  const userMission = await getUserMissionById(userMissionId);
  if (!userMission) {
    // 커스텀 에러 처리 구현
  }

  // 중복 리뷰 방지
  const existing = await findRiviewByUserMissionId(userMissionId);
  if (existing) {
    // 커스텀 에러 처리 구현
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