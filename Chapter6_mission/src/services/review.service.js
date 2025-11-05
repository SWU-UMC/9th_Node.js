// src/services/review.service.js
import {
  addReview,
  getAllStoreReviews,
  getUserReviews,
} from "../repositories/review.repository.js";

import {
  responseFromReview,
  responseFromReviews,
  responseFromUserReviews,
} from "../dtos/review.dto.js";

// 리뷰 등록
export const createReview = async (reviewData) => {
  const review = await addReview(reviewData);
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