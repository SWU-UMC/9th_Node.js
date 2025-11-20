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
    }
}
