import { prisma } from "../db.config.js";
import { regionExists } from "../repositories/region.repository.js";
import {
  createStoreInDB,
  getStoreById,
} from "../repositories/store.repository.js";

export const createStore = async (data) => {
  const { region_id, name, address } = data;

  if (!region_id || !name) {
    throw new Error("region_id와 name은 필수입니다.");
  }

  const exists = await regionExists(region_id);
  if (!exists) throw new Error("존재하지 않는 지역입니다.");

  const storeId = await createStoreInDB({ region_id, name, address });

  return { id: storeId, region_id, name, address };
};

export const ensureStoreExists = async (storeIdFromPath) => {
  const storeId = Number(storeIdFromPath);
  if (!Number.isFinite(storeId))
    throw new Error("유효하지 않은 storeId 입니다.");
  const store = await getStoreById(storeId);
  if (!store) throw new Error("존재하지 않는 가게입니다.");
  return store;
};

export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      store: true,
      user: { select: { name: true } },
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });
  return reviews;
};
