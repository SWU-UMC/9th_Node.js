import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { getFirstUserId } from "../repositories/common.repository.js";

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
