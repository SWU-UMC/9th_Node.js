import { 
  responseFromRestaurant,
  responseFromReviews,
 } from "../dtos/restaurant.dto.js";
import {
  addRestaurant,
  getRestaurantById,
  getAllRestaurantReviews,
} from "../repositories/restaurant.repository.js";
import { RestaurantNotFoundError } from "../error.js";

export const createRestaurant = async (data) => {
  const newRestaurantId = await addRestaurant(data);

  const newRestaurant = await getRestaurantById(newRestaurantId);

  if (newRestaurant === null) {
    throw new RestaurantNotFoundError(`존재하지 않는 가게입니다. (ID: ${restaurantId})`);
  }

  return responseFromRestaurant(newRestaurant);
};

export const listRestaurantReviews = async (restaurantId) => {
  const reviews = await getAllRestaurantReviews(restaurantId);
  return responseFromReviews(reviews);
};