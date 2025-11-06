import { StatusCodes } from "http-status-codes";
import { restaurantAdd } from "../services/restaurant.service.js";

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