import { StatusCodes } from "http-status-codes";
import { reviewAdd } from "../services/review.service.js";

export const addReviewController = async (req, res, next) => {
    try {
        const { mission_id } = req.params;
        const user_id = req.user_id
        const review = await reviewAdd(user_id, mission_id, req.body);

        res.status(StatusCodes.OK).json({ result: review });
  } catch (err) {
    console.error("Controller Error: ", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "서버 에러가 발생했습니다."
    });
  }
}