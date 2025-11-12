import { prisma } from "../db.config.js";

// 가게 존재 여부 확인
export const getStoreById = async (storeId) => {
  return prisma.store.findUnique({
    where: { id: missionData.storeId },
    select: { id: true },
  });
}

// 미션 등록
export const addMission = async (missionData) => {
  // 미션 생성
  const mission = await prisma.mission.create({
    data: {
      storeId: missionData.storeId,
      title: missionData.title,
      description: missionData.description,
      point: missionData.point,
      deadline: missionData.deadline,
    },
  });

  // 생성된 미션 반환
  return mission;
};

// 특정 가게의 미션 목록 조회
export const getMissionsByStoreId = async (storeId) => {
  try {
    const missions = await prisma.mission.findMany({
      where: { storeId: Number(storeId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        point: true,
        deadline: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return missions;
  } catch (err) {
    throw new Error(`미션 목록 조회 중 오류 발생: ${err.message}`);
  }
};