import {
  bodyToReview,
  responseFromReviews,
  toPlainReview,
} from "../dtos/review.dto.js";
import {
  addReview,
  findReviewsByUser,
} from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { getFirstUserId } from "../repositories/common.repository.js";
import { StoreNotFoundError, UserNotFoundError } from "../errors.js";
import { ensureCursorTake, ensureNumber } from "../utils/validation.js";

export const addReviewToStore = async (rawBody, storeIdFromPath) => {
  const data = bodyToReview({
    ...rawBody,
    storeId: storeIdFromPath ?? rawBody.storeId,
  });

  const store = await getStoreById(data.storeId);
  if (!store) throw new StoreNotFoundError(data.storeId);

  const userId = await getFirstUserId();
  if (!userId) {
    throw new UserNotFoundError(
      undefined,
      "사용자가 없습니다. 먼저 회원가입을 진행하세요."
    );
  }

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
  if (!userId) {
    throw new UserNotFoundError(
      undefined,
      "사용자가 없습니다. 먼저 회원가입을 진행하세요."
    );
  }
  const { cursor: c, take: t } = ensureCursorTake(cursor, take);

  const rows = await findReviewsByUser({ userId, cursor: c, take: t });

  // BigInt → JSON
  const data = rows.map(toPlainReview);
  return responseFromReviews(data);
};

// userId로 리뷰 목록 조회
export const listReviewsByUserId = async (
  userIdParam,
  cursor = 0,
  take = 5
) => {
  const userId = ensureNumber(userIdParam, "userId");
  const { cursor: c, take: t } = ensureCursorTake(cursor, take);

  const rows = await findReviewsByUser({ userId, cursor: c, take: t });
  const data = rows.map(toPlainReview);
  return responseFromReviews(data);
};
