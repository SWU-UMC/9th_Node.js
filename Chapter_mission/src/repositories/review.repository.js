// src/repositories/review.repository.js
import { prisma } from "../db.config.js";

// 가게 조회
export const getStoreById = (storeId) =>
  prisma.store.findUnique({ where: { id: storeId }, select: { id: true } });

// 유저 미션 조회
export const getUserMissionById = (userMissionId) =>
  prisma.userMission.findUnique({
    where: { id: userMissionId },
    select: { id: true, status: true },
  });

// 중복 리뷰 존재 확인
export const findReviewByUserMissionId = (userMissionId) =>
  prisma.review.findFirst({
    where: { userMissionId },
    select: { id: true },
  });

// 리뷰 생성
export const createReview = (data) => prisma.review.create({ data });

// 가게별 리뷰 조회
export const getAllStoreReviews = async (storeId, cursor) =>
  prisma.review.findMany({
    where: {
      userMission: { mission: { storeId } },
      id: cursor ? { gt: cursor } : undefined,
    },
    include: {
      userMission: {
        include: {
          user: { select: { id: true, nickname: true, profileImage: true } },
        },
      },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

// 내가 작성한 리뷰 목록 조회
export const getUserReviews = async (userId, cursor) =>
  prisma.review.findMany({
    where: {
      userMission: { userId },
      id: cursor ? { gt: cursor } : undefined,
    },
    include: {
      userMission: {
        include: {
          mission: {
            include: { store: { select: { id: true, name: true } } },
          },
        },
      },
    },
    orderBy: { id: "asc" },
    take: 5,
  });