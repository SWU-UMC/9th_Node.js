// src/repositories/store.repository.js
import { prisma } from "../db.config.js";

/**
 * 가게 등록 (Prisma ORM)
 * @param {Object} storeData - { regionId, categoryId, name, address, description }
 * @returns {Object} 생성된 store 객체
 */
export const addStore = async (storeData) => {
  // 지역 존재 여부 확인
  const region = await prisma.region.findUnique({
    where: { id: storeData.regionId },
    select: { id: true },
  });

  if (!region) {
    throw new Error("해당 지역이 존재하지 않습니다.");
  }

  // 같은 지역 내 중복 이름 확인
  const duplicate = await prisma.store.findFirst({
    where: {
      name: storeData.name,
      regionId: storeData.regionId,
    },
  });

  if (duplicate) {
    throw new Error("이미 동일한 이름의 가게가 존재합니다.");
  }

  // 새 가게 등록
  const store = await prisma.store.create({
    data: {
      regionId: storeData.regionId,
      categoryId: storeData.categoryId,
      name: storeData.name,
      address: storeData.address,
      description: storeData.description,
    },
  });

  // 등록된 가게 정보 반환
  return store;
};