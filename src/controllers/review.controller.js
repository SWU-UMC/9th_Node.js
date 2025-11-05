import { StatusCodes } from "http-status-codes";
import { reviewAdd } from "../services/review.service.js";
import { getMyReviews } from "../repositories/review.repository.js";

export const addReviewController = async (req, res, next) => {
    try {
        const { mission_id } = req.params;
        const user_id = 1;
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

export const handleRestaurantReviewList = async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const { cursor, limit = 5 } = req.query;

    const { restaurant_name, reviews, nextCursor } = await getMyReviews(
      restaurantId,
      cursor,
      Number(limit)
    );

    return res.status(200).json({
      success: true,
      message: "리뷰 목록 조회 성공",
      restaurant_name, // 상단 고정용
      data: reviews.map(r => ({
        review_id: r.review_id,
        name: r.user.name,
        rating: r.rating,
        content: r.content,
        created_at: r.created_at,
      })),
      nextCursor,
    });
  } catch (err) {
    console.error("handleRestaurantReviewList Error:", err);
    res.status(500).json({ success: false, message: "서버 에러 발생" });
  }
};