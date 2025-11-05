import { StatusCodes } from "http-status-codes";
import { bodyToRestaurant } from "../dtos/restaurant.dto.js";
import { 
  createRestaurant,
  listRestaurantReviews,
 } from "../services/restaurant.service.js";

export const handleAddRestaurant = async (req, res, next) => {
  console.log("가게 추가를 요청했습니다");
  console.log("body:", req.body);

  try {
    const restaurantData = bodyToRestaurant(req.body);

    const newRestaurant = await createRestaurant(restaurantData);

    res.status(StatusCodes.CREATED).json({ result: newRestaurant });

  } catch (err) {
    next(err); 
  }
};

export const handleListRestaurantReviews = async (req, res, next) => {
  const reviews = await listRestaurantReviews(
    parseInt(req.params.restaurantId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).json(reviews);
};