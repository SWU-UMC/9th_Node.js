import { addRestaurant, getRestaurantById } from "../repositories/restaurant.repository.js";
import { bodyToRestaurant, responseFromRestaurant } from "../dtos/restaurant.dto.js";

export const restaurantAdd = async (body) => {
  const restaurantData = bodyToRestaurant(body); // 여기서 변환
  if (!restaurantData.restaurant_name) {
    throw new Error("restaurant_name은 필수입니다.");
  }

  const restaurantId = await addRestaurant(restaurantData);
  const restaurant = await getRestaurantById(restaurantId);

  return responseFromRestaurant(restaurant);
};
