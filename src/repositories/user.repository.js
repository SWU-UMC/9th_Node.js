import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email }
  });
  if (user) {
    return null;
  }
  const created = await prisma.user.create({ data: data});
  return created.id
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId }
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
    orderBy: {
      foodCategory: {
            name: "asc" // foodCategory 관계를 통해 name 필드를 기준으로 오름차순 정렬
        }
      }
  });
  return preferences;
};

export const responseFromUser = (user, preferences) => ({
    id:user.id,
    token: token,
    email: user.email,
    name: user.name,
    address: user.address,
    detailAddress: user.detailAddress,
    phoneNumber: user.phoneNumber,
    preferences: preferences.map((pref) => ({
        id: pref.foodCategoryId,
        name: pref.name
    }))
});

export const updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                gender: true,
                birth: true,
                address: true,
                detailAddress: true,
                phoneNumber: true,
            },
        });
        return updatedUser;
    } catch (error) {
        return null;
    }
};

export const updateUserPreferences = async (userId, foodCategoryIds) => {
    await prisma.$transaction(async (tx) => {
        // 기존 선호 카테고리 전체 삭제
        await tx.userFavorCategory.deleteMany({
            where: { userId: userId },
        });

        // 새로운 카테고리 레코드 준비 및 생성
        if (foodCategoryIds && foodCategoryIds.length > 0) {
            const preferenceRecords = foodCategoryIds.map(foodCategoryId => ({
                userId: userId,
                foodCategoryId: foodCategoryId
            }));
            
            await tx.userFavorCategory.createMany({
                data: preferenceRecords,
                skipDuplicates: true,
            });
        }
    });
};
