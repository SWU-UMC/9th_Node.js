//import { pool } from "../db.config.js";
import { prisma } from "../db.config.js";

// // 사용자 생성
// export const addUser = async (data) => {
//   // 중복 이메일 검사
//   const user = await prisma.user.findFirst({
//     where: { email: data.email },
//   });
//   if (user) {
//     return null;
//   }

//   // 새로운 사용자 생성
//   const created = await prisma.user.create({
//     data: data,
//   });

//   // 새로 생성된 유저의 ID 반환
//   return created.id;
// };

// 사용자 정보 조회
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }, // DB의 id가 BigInt이므로 변환
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(`유저 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 유저 및 선호 카테고리 조회(마이페이지, 유저 상세 프로필 등)
export const getUserWithPreferences = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        userFavorCategories: {
          include: { category: true },
        },
      },
    });

    return user;
  } catch (err) {
    throw new Error(`유저 및 선호 카테고리 조회 중 오류 발생: ${err.message}`);
  }
};

// 유저 선호 카테고리 추가
export const setPreference = async (userId, categoryId) => {
  try {
    await prisma.userFavorCategory.create({
      data: {
        userId: Number(userId),
        categoryId: Number(categoryId),
      },
    });
  } catch (err) {
    throw new Error(`선호 카테고리 추가 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 유저 선호 카테고리 조회(카테고리 필터링, 추천 등)
export const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.userFavorCategory.findMany({
      where: { userId: Number(userId) },
      include: {
        category: true, // 연결된 카테고리 이름 등 함께 조회
      },
      orderBy: {
        categoryId: "asc",
      },
    });

    return preferences;
  } catch (err) {
    throw new Error(`선호 카테고리 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};