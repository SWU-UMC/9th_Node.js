import { prisma } from "../db.config.js";

//유저가 이미 도전했는지 확인
export const findUserByMission = async (user_id, mission_id) => {
  try {
    const user_mission = await prisma.user_mission.findFirst({
      where: {
        user_id,
        mission_id,
      },
    });
    return user_mission;
  } catch (error) {
    console.error("도전 확인 중 에러:", error);
  }
};

//도전 중인 미션 생성 (status = 1)
export const createUserMission = async (data) => {
  try {
    const user_mission = await prisma.user_mission.create({
      data: {
        mission_id: data.mission_id,
        user_id: data.user_id,
        completed_id: data.completed_id,
        status: 1,
        start_date: new Date(), // NOW() 대체
      },
    });
    return user_mission.user_mission_id; // PK 반환
  } catch (error) {
    console.error("도전 미션 생성 중 에러: ", error);
  }
};

//user_mission_id 유저 미션 조회
export const getUserMissionById = async (user_mission_id) => {
  try {
    const user_mission = await prisma.user_mission.findUnique({
      where: { user_mission_id: user_mission_id },
    });
    return user_mission;
  } catch (error) {
    console.error("유저 미션 조회 중 에러:", error);
  }
};


// user_id 기준 진행중 미션 목록 조회 (커서 기반)
export const getOngoingMissions = async (user_id, cursor = 0, limit = 5) => {
  const userMissions = await prisma.user_mission.findMany({
    where: {
      user_id: Number(user_id),
      status: 0, // 진행중
    },
    select: {
      user_mission_id: true,

      mission: {
        select: {
          mission_id: true,
          title: true,
          description: true,
          reward: true,
          restaurant: {
        select: {
          restaurant_name: true,
        },
      },
        },
      },
    },
    orderBy: { user_mission_id: "asc" },
    take: limit,
    ...(cursor ? { cursor: { user_mission_id: Number(cursor) }, skip: 1 } : {}),
  });

  const nextCursor = userMissions.length > 0 ? userMissions[userMissions.length - 1].user_mission_id: null;
  return { missions: userMissions, nextCursor };
};