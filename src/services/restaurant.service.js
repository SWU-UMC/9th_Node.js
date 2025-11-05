import { 
  responseFromRestaurant,
  responseFromReviews,
 } from "../dtos/restaurant.dto.js";
import {
  addRestaurant,
  getRestaurantById,
  getAllRestaurantReviews,
} from "../repositories/restaurant.repository.js";

export const createRestaurant = async (data) => {
  const newRestaurantId = await addRestaurant(data);

  const newRestaurant = await getRestaurantById(newRestaurantId);

  if (newRestaurant === null) {
    throw new Error("가게 정보를 조회하는 데 실패했습니다.");
  }

  return responseFromRestaurant(newRestaurant);
};

export const listRestaurantReviews = async (restaurantId) => {
  const reviews = await getAllRestaurantReviews(restaurantId);
  return responseFromReviews(reviews);
};