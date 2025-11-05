import { responseFromMission } from "../dtos/mission.dto.js";
import { addMission, getMissionById } from "../repositories/mission.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";

export const missionAdd = async (data) => {
    const restaurantId = data.restaurant_id;
    const existingRestaurant = await getRestaurantById(restaurantId);
    if(!existingRestaurant) {
       throw new Error ("해당하는 레스토랑이 존재하지 않습니다.");
   }

    if(!data.title) {
        throw new Error("미션 제목을 입력해주세요.");
    }
    const mission_id = await addMission(data); 
    const newMission = await getMissionById(mission_id);
    return responseFromMission(newMission);
};

//특정 레스토링 미션 조회
export const missionListByRestaurant = async (restaurant_id, cursor = 0, limit = 5) => {
  const missions = await missionListByRestaurantRepo(restaurant_id, cursor, limit);
  const nextCursor = missions.length > 0 ? missions[missions.length - 1].mission_id : null;

  return { missions: responseFromMission(missions), nextCursor };
};