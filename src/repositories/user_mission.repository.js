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
  } catch (err) {
    console.error("도전 확인 중 에러:", err);
    throw err;
  }
};

//도전 중인 미션 생성 (status = 0)
export const createUserMission = async (data) => {
  try {
    const user_mission = await prisma.user_mission.create({
      data: {
        mission_id: data.mission_id,
        user_id: data.user_id,
        restaurant_id: data.restaurant_id,
        status: 0,
        start_date: new Date(), // NOW() 대체
      },
    });
    return user_mission.completed_id; // PK 반환
  } catch (err) {
    console.error("도전 미션 생성 중 에러: ", err);
    throw err;
  }
};

//completed_id로 유저 미션 조회
export const getUserMissionById = async (completedId) => {
  try {
    const user_mission = await prisma.user_mission.findUnique({
      where: { completed_id: completedId },
    });
    return user_mission;
  } catch (err) {
    console.error("유저 미션 조회 중 에러:", err);
    throw err;
  }
};


// user_id 기준 진행중 미션 목록 조회 (커서 기반)
export const getOngoingMissions = async (user_id, cursor = 0, limit = 5) => {
  const missions = await prisma.user_mission.findMany({
    where: {
      user_id: Number(user_id),
      status: 0, // 진행중
    },
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
    orderBy: { mission_id: "asc" },
    take: limit,
    ...(cursor ? { cursor: { mission_id: Number(cursor) }, skip: 1 } : {}),
  });

  return missions;
};