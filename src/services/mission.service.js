import { responseFromMission } from "../dtos/mission.dto.js";
import { addMission, getMissionById } from "../repositories/mission.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { ResourceNotFoundError, InvalidInputError } from "../errors.js";

export const missionAdd = async (data) => {
    const restaurantId = data.restaurant_id;
    const existingRestaurant = await getRestaurantById(restaurantId);
    if(!existingRestaurant) {
       throw new ResourceNotFoundError ("해당하는 레스토랑이 존재하지 않습니다.", data);
   }

    if(!data.title) {
        throw new InvalidInputError("미션 제목을 입력해주세요.", data);
    }
    const mission_id = await addMission(data); 
    const newMission = await getMissionById(mission_id);
    return responseFromMission(newMission);
};