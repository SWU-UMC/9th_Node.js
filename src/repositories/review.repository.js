import { prisma } from "../db.config.js";

export const addReview = async ({ score, body, userId, storeId }) => {
  const review = await prisma.review.create({
    data: {
      score: Number(score),
      body,
      user: { connect: { id: Number(userId) } },
      store: { connect: { id: Number(storeId) } },
    },
  });
  return review;
};

export const findReviewsByUser = async ({ userId, cursor = 0, take = 5 }) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      score: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      storeId: true,
      store: { select: { id: true, name: true } },
    },
    where: {
      userId: BigInt(userId),
      id: { gt: BigInt(cursor) },
    },
    orderBy: { id: "asc" },
    take,
  });

  return reviews;
};
