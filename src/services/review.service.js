import { bodyToReview, toPlainReview } from "../dtos/review.dto.js";
import {
  addReview,
  findReviewsByUser,
} from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { getFirstUserId } from "../repositories/common.repository.js";
import { responseFromReviews } from "../dtos/store.dto.js";

export const addReviewToStore = async (rawBody, storeIdFromPath) => {
  const data = bodyToReview({
    ...rawBody,
    storeId: storeIdFromPath ?? rawBody.storeId,
  });

  if (!data.storeId || data.score === null) {
    throw new Error("storeId, score는 필수입니다.");
  }

  const store = await getStoreById(data.storeId);
  if (!store) throw new Error("존재하지 않는 가게입니다.");

  const userId = await getFirstUserId();
  if (!userId)
    throw new Error("사용자가 없습니다. 먼저 회원가입을 진행하세요.");

  const review = await addReview({
    score: data.score,
    body: data.body,
    userId,
    storeId: data.storeId,
  });

  return review;
};

export const listMyReviews = async (maybeUserId, cursor = 0, take = 5) => {
  const userId = maybeUserId ?? (await getFirstUserId());
  if (!userId)
    throw new Error("사용자가 없습니다. 먼저 회원가입을 진행하세요.");

  const rows = await findReviewsByUser({ userId, cursor, take });

  // BigInt → JSON
  const data = rows.map(toPlainReview);
  return responseFromReviews(data);
};

// userId로 리뷰 목록 조회
export const listReviewsByUserId = async (userId, cursor = 0, take = 5) => {
  const rows = await findReviewsByUser({ userId, cursor, take });

  const data = rows.map(toPlainReview);
  return responseFromReviews(data);
};
