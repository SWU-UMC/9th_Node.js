import { prisma } from "../db.config.js";

export const addMission = async (data) => {
    try {
        const mission = await prisma.mission.create({
            data: {
                restaurant_id: data.restaurant_id,
                title: data.title,
                description: data.description,
                reward: data.reward,
            },
        });
        return mission.mission_id
  } catch (err) {
    console.error("미션 추가 중 에러:", err);
    throw err;
  }
};

//ID로 특정 미션 조회하기
export const getMissionById = async (mission_id) => {
    try {
        const mission = await prisma.mission.findUnique({
            where: {
                mission_id: mission_id,
            },
        });
        return mission || null;
    } catch (err) {
        console.error("ID로 특정 미션 조회 중 에러: ", err);
        throw err;
    }
}

//mission-06
//레스토랑 ID로 미션 조회하기
export const getMissionsByRestaurantId = async (req, res) => {
  try {
    const missions = await prisma.mission.findMany({
      where: { restaurant_id: Number(restaurant_id) },
      select: {
        mission_id: true,
        title: true,
        description: true,
        reward: true,
      },
      orderBy: { mission_id: "asc" },
      take: limit,
      ...(cursor && { cursor: { mission_id: Number(cursor) }, skip: 1 }),
    });

    const nextCursor = missions.length > 0 ? missions[missions.length - 1].mission_id : null;

    return { missions, nextCursor };
  } catch (err) {
    console.error("레스토랑 ID로 미션 조회 중 에러:", err);
    throw err;
  }
};