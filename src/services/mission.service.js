import { responseFromMission } from "../dtos/mission.dto.js";
import { addMission, getMissionById } from "../repositories/mission.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";

export const missionAdd = async (restaurant_id, body) => {
    const existingRestaurant = await getRestaurantById(restaurant_id);
    if(!existingRestaurant) {
        throw new Error ("해당하는 레스토랑이 존재하지 않습니다.");
    }

    //미션 제목 유효성 검사
    if(!body.title) {
        throw new Error("미션 제목을 입력해주세요.");
    }

    //미션 데이터 객체
    const missionData = {
        restaurant_id: restaurant_id,
        title: body.title,
        description: body.description,
        reward: body.reward
    };

    const mission_id = await addMission(missionData);
    const newMission = await getMissionById(mission_id);
    return responseFromMission(newMission);
}