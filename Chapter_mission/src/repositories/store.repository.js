// src/repositories/store.repository.js
import { prisma } from "../db.config.js";

// 지역 존재 확인
export const getRegionById = async (regionId) => {
  return prisma.region.findUnique({
    where: { id: regionId },
    select: { id: true }
  });
};

// 가게 중복 확인
export const findDuplicateStore = async (regionId, name) => {
  return prisma.store.findFirst({
    where: { name, regionId }
  });
};

/**
 * 가게 등록 (Prisma ORM)
 * @param {Object} storeData - { regionId, categoryId, name, address, description }
 * @returns {Object} 생성된 store 객체
 */
export const addStore = async (storeData) => {
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