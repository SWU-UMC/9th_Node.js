import { prisma } from "../db.config.js";

// 도전 중복 확인
export const existsUserMission = async ({ userId, missionId }) => {
  const count = await prisma.userMission.count({
    where: { userId: Number(userId), missionId: Number(missionId) },
  });
  return count > 0;
};

// 도전 등록 (기본 상태 IN_PROGRESS)
export const addUserMission = async ({ userId, missionId }) => {
  const um = await prisma.userMission.create({
    data: {
      user: { connect: { id: Number(userId) } },
      mission: { connect: { id: Number(missionId) } },
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });
  return um;
};

export const findUserMission = async (userId, missionId) => {
  return prisma.userMission.findUnique({
    where: {
      userId_missionId: {
        userId: BigInt(userId),
        missionId: BigInt(missionId),
      },
    },
  });
};

export const completeUserMission = async (userId, missionId) => {
  // 상태 COMPLETED, 완료시각 지금
  return prisma.userMission.update({
    where: {
      userId_missionId: {
        userId: BigInt(userId),
        missionId: BigInt(missionId),
      },
    },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
    include: {
      mission: true,
    },
  });
};
