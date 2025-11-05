import { prisma } from "../db.config.js";

// 미션 데이터 삽입
export const addMission = async (data) => {
  try {
    const newMission = await prisma.mission.create({
      data: {
        point: data.point,
        content: data.content,
        deadline: data.deadline,

        restaurant: {
          connect: { id: data.restaurantId }, 
        },
      },
    });
    return newMission;
  } catch (err) {
    if (err.code === 'P2003') {
      throw new Error(`[Validation Error] 존재하지 않는 가게 ID입니다.`);
    }
    console.error(err);
    throw new Error(`DB 오류가 발생했습니다: ${err.message}`);
  }
};

// ID로 미션 정보 얻기
export const getMissionById = async (missionId) => {
  const mission = await prisma.mission.findUnique({where: {id: missionId}});
  return mission;
};

// 사용자가 특정 미션에 도전 중인지 확인 (검증용)
export const checkUserMissionExists = async (userId, missionId) => {
  const existingMission = await prisma.user_mission.findUnique({
    where: {
      userId_missionId: {
        userId: userId,
        missionId: missionId,
      },
    },
  });
  
  return !!existingMission;
};

// 사용자가 미션에 도전
export const addUserMission = async (data) => {
  const newUserMission = await prisma.user_mission.create({
      data: {
        user: { connect: { id: data.userId } },
        mission: { connect: { id: data.missionId } },
      },
  });
  return newUserMission;
};

// ID로 user_mission 정보 조회 (방금 추가한 '도전' 확인용)
export const getUserMissionById = async (userMissionId) => {
  const userMission = await prisma.user_mission.findUnique({
    where: { id: userMissionId },
  });
  return userMission;
};