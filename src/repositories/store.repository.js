import { prisma } from "../db.config.js";

export const createStoreInDB = async (data) => {
  const created = await prisma.store.create({
    data: {
      name: data.name,
      address: data.address ?? "",
      score: 0,
      region: { connect: { id: Number(data.region_id) } },
    },
    select: { id: true },
  });
  return created.id;
};

export const getStoreById = async (storeId) => {
  return prisma.store.findUnique({
    where: { id: Number(storeId) },
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
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
