import { prisma } from "../db.config.js";

/** 특정 가게 리뷰 목록 (cursor 기반 페이지네이션) */
export const listStoreReviews = async (storeId, cursor = 0) => {
  return await prisma.mission_review.findMany({
    where: { restaurant_id: storeId, review_id: { gt: cursor } },
    orderBy: { review_id: "asc" },
    take: 5,
    select: {
      review_id: true,
      content: true,
      rating: true,
      photo: true,
      owner_reply: true,
      created_at: true,
      user: { select: { id: true, nickname: true } },
    },
  });
};

/** 특정 유저의 리뷰 목록 */
export const findReviewsByUserId = async (userId) => {
  return await prisma.mission_review.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_at: "desc" },
    select: {
      review_id: true,
      content: true,
      rating: true,
      photo: true,
      owner_reply: true,
      created_at: true,
      restaurant: { select: { restaurant_name: true } },
      user: { select: { nickname: true, profile_image: true } },
    },
  });
};