import { prisma } from "../db.config.js";

export const addMission = async ({
  storeId,
  reward,
  deadline,
  missionSpec,
}) => {
  const mission = await prisma.mission.create({
    data: {
      store: { connect: { id: Number(storeId) } },
      reward: Number(reward),
      deadline: deadline ? new Date(deadline) : null,
      missionSpec,
    },
  });
  return mission;
};

export const getMissionById = async (missionId) => {
  return prisma.mission.findUnique({
    where: { id: Number(missionId) },
  });
};

// 특정 가게 미션 조회
export const findMissionsByStore = async ({
  storeId,
  cursor = 0,
  take = 5,
}) => {
  return prisma.mission.findMany({
    where: { storeId: BigInt(storeId) },
    orderBy: { id: "asc" },
    take,
    skip: cursor,
  });
};

// 특정 유저의 진행 중인 미션 조회
export const findUserMissions = async (
  userId,
  status,
  cursor = 0,
  take = 5
) => {
  return prisma.userMission.findMany({
    where: {
      userId: BigInt(userId),
      status,
      ...(cursor > 0 ? { missionId: { gt: BigInt(cursor) } } : {}),
    },
    orderBy: { missionId: "asc" },
    take,
    include: {
      mission: true,
    },
  });
};
