import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created= await prisma.user.create({ data: data});
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
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

// 특정 유저가 작성한 리뷰 목록 조회
export const getAllUserReviews = async (userId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      restaurant: true,
      user: true,
    },
    where : {userId: userId, id: {gt: cursor}},
    orderBy: {id: "asc"},
    take: 5,

  });

  return reviews;
}

// 유저가 진행중인 미션
export const getAllUserMissions = async (userId, cursor) => {
  const missions = await prisma.userMission.findMany({
    select: {
      id: true,
      status: true,
      mission: true,
      user: true,
    },
    where : {userId: userId, status: "진행중", id: {gt: cursor}},
    orderBy: {id: "asc"},
    take: 5,
  });
  return missions;
};

// 유저 정보 수정
export const updateUserInfo = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });
  return updatedUser;
};