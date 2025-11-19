import { prisma } from "../db.config.js";
import { NotFoundError, StoreNotFoundError } from "../errors.js";
import { regionExists } from "../repositories/region.repository.js";
import {
  createStoreInDB,
  getStoreById,
} from "../repositories/store.repository.js";
import {
  ensureCursorTake,
  ensurePositiveInt,
  ensureString,
} from "../utils/validation.js";
import { bodyToStore } from "../dtos/store.dto.js";

export const createStore = async (raw) => {
  const { regionId, name, address } = bodyToStore(raw);

  const exists = await regionExists(regionId);
  if (!exists) {
    throw new NotFoundError("존재하지 않는 지역입니다.", { regionId }, "R001");
  }

  const storeId = await createStoreInDB({ regionId, name, address });
  return { id: Number(storeId), regionId, name, address: address ?? "" };
};

export const ensureStoreExists = async (storeIdFromPath) => {
  const storeId = ensurePositiveInt(storeIdFromPath, "storeId");

  const store = await getStoreById(storeId);
  if (!store) {
    throw new StoreNotFoundError(storeId);
  }
  return store;
};

// 가게 리뷰 목록 조회
export const listStoreReviews = async (storeIdFromPath, cursor = 0) => {
  const storeId = ensurePositiveInt(storeIdFromPath, "storeId");
  const { cursor: c } = ensureCursorTake(cursor, 5);
  await ensureStoreExists(storeId);

  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
    where: {
      storeId: BigInt(storeId),
      ...(c > 0 ? { id: { gt: BigInt(c) } } : {}),
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
