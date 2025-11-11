import { StatusCodes } from "http-status-codes";
import { restaurantAdd, listRestaurantReviews } from "../services/restaurant.service.js";

export const regionForRestaurant = async (req, res, next) => {
  try {
    console.log("body:", req.body);
    const restaurant = await restaurantAdd(req.body); 
    res.status(StatusCodes.CREATED).json({ result: restaurant });
  } catch (err) {
    console.error("Controller Error: ", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "서버 에러가 발생했습니다."
    });
  }
};

export const handleListRestaurantReviews = async (req, res, next) => {
  const reviews = await listRestaurantReviews(
    parseInt(req.params.restaurant_id),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};