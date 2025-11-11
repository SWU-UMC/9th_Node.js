// src/repositories/userMission.repository.js
import { prisma } from "../db.config.js";

// 이미 도전 중인지 확인
export const findActiveChallenge = async (userId, missionId) => {
  return await prisma.userMission.findFirst({
    where: {
      userId,
      missionId,
      status: "IN_PROGRESS",
    },
  });
};

// 도전 시작 (user_mission 생성)
export const addUserMission = async (userId, missionId) => {
  return await prisma.userMission.create({
    data: {
      userId,
      missionId,
      status: "IN_PROGRESS",
    },
  });
};

// 생성된 도전 정보 조회
export const getUserMissionById = async (id) => {
  return await prisma.userMission.findUnique({
    where: { id },
  });
};

// 특정 유저의 진행 중(IN_PROGRESS) 미션 목록 조회
export const findActiveMissionsByUserId = async (userId) => {
  return await prisma.userMission.findMany({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
    include: {
      mission: {
        include: {
          store: {
            select: { id: true, name: true, address: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// 미션 상태 업데이트
export const updateUserMissionStatus = async (userMissionId, newStatus) => {
  const updated = await prisma.userMission.update({
    where: { id: userMissionId },
    data: { status: newStatus },
  });
  return updated;
};