import { prisma } from "../db.config.js";

export const createStoreInDB = async ({ regionId, name, address }) => {
  const created = await prisma.store.create({
    data: {
      name,
      address: address ?? "",
      score: 0,
      region: { connect: { id: BigInt(regionId) } },
    },
    select: { id: true },
  });
  return created.id;
};

export const getStoreById = async (storeId) => {
  return prisma.store.findUnique({
    where: { id: BigInt(storeId) },
  });
};

export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      storeId: true,
      userId: true,
      store: true,
      user: true,
    },
    where: {
      storeId: BigInt(storeId),
      ...(cursor > 0 ? { id: { gt: BigInt(cursor) } } : {}),
    },
    orderBy: { id: "asc" },
    take,
  });

  return reviews;
};
