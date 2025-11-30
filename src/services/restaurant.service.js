import { addRestaurant, getRestaurantById, getAllRestaurantReviews, getMissionsByRestaurantId } from "../repositories/restaurant.repository.js";
import { bodyToRestaurant, responseFromRestaurant } from "../dtos/restaurant.dto.js";
import { responseFromMission } from "../dtos/mission.dto.js";
import { InvalidInputError } from "../errors.js";

export const restaurantAdd = async (body) => {
  const restaurantData = bodyToRestaurant(body);
  if (!restaurantData.restaurant_name) {
    throw new InvalidInputError("restaurant_name은 필수입니다.", body);
  }
  const newRestaurant = await addRestaurant(restaurantData);
  return responseFromRestaurant(newRestaurant);
};


//특정 레스토랑의 리뷰 조회
export const listRestaurantReviews = async (restaurant_id, cursor) => {
  const { reviews, nextCursor } = await getAllRestaurantReviews(restaurant_id, cursor);
  const missionsDto = result.missions.map((m) => responseFromMission(m));
  return {
        missions: missionsDto,
    };
};

//특정 레스토링 미션 조회
export const missionListByRestaurant = async (restaurant_id, cursor = 0, limit = 5) => {
  const result = await getMissionsByRestaurantId(restaurant_id, cursor, limit);
  const missionsDto = responseFromMission(result.missions);

  return { missions: missionsDto, nextCursor: result.nextCursor };
};
