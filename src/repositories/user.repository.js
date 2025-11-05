import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      specAddress: data.specAddress,
      passwordHash: data.password,
    },
  });
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: BigInt(userId) },
  });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.userPrefer.create({
    data: {
      userId: BigInt(userId),
      categoryId: BigInt(foodCategoryId),
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userPrefer.findMany({
    select: {
      userId: true,
      categoryId: true,
      category: true,
    },
    where: { userId: BigInt(userId) },
    orderBy: { categoryId: "asc" },
  });
  return preferences;
};
