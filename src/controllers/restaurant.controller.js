import { StatusCodes } from "http-status-codes";
import { restaurantAdd, listRestaurantReviews, missionListByRestaurant } from "../services/restaurant.service.js";

export const regionForRestaurant = async (req, res, next) => {
  try {
    console.log("body:", req.body);
    const restaurant = await restaurantAdd(req.body); 
    res.status(StatusCodes.OK).success(restaurant);
  } catch (error) {
    next(error);
    }
  };

//특정 레스토랑의 리뷰 목록
export const handleListRestaurantReviews = async (req, res, next) => {
  try {
  const reviews = await listRestaurantReviews(
    parseInt(req.params.restaurant_id),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
} catch (error) {
  next(error);
}
};

//특정 레스토랑 미션 목록
export const getMissionsByRestaurantController = async (req, res, next) => {
  try {
    const { restaurant_id } = req.params;
    const { cursor, limit } = req.query;

    const result = await missionListByRestaurant(
      restaurant_id,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};