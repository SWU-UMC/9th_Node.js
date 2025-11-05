import { prisma } from "../db.config.js";

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, nickname: true } },
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5, // 페이지당 5개만 설정함. 
  });

  return reviews;
};