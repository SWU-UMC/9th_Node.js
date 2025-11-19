import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  // phoneNumber가 없으면 제외하고 생성
  const { phoneNumber, ...userData } = data;
  const createData = phoneNumber ? data : userData;

  const created = await prisma.user.create({ data: createData });
  return created.id;
};

// 사용자 정보 조회
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ 
    where: { id: userId },
    include: {
      userFavorCategories: {
        include: {
          foodCategory: true
        }
      }
    }
  });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userFavorCategory.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};