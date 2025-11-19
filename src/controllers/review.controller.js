import { StatusCodes } from "http-status-codes";
import { reviewAdd } from "../services/review.service.js";
import { getMyReviews } from "../repositories/review.repository.js";

export const addReviewController = async (req, res, next) => {
    try {
        const { restaurant_id } = req.params;
        const { user_id, mission_id } = req.body;

      const review = await reviewAdd(
      Number(user_id), 
      Number(mission_id),  
      req.body // content, rating, photo 등이 담긴 객체
    );

        res.status(StatusCodes.OK).success(review);
  } catch (error) {
    next(error);
    }
  };

// '내가 쓴 리뷰' 목록을 조회하는 전용 컨트롤러
export const handleUserReviewList = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.user_id); 
    const { cursor, limit = 5 } = req.query;

    if (isNaN(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).error({
            errorCode: "U004",
            reason: "유효하지 않은 사용자 ID 형식입니다."
        });
    }

    const { reviews, nextCursor } = await getMyReviews(
      userId,
      cursor,
      Number(limit)
    );

    return res.status(200).json({
      success: true,
      message: "내가 쓴 리뷰 목록 조회 성공",
      data: reviews.map(r => ({
        review_id: r.review_id,
        restaurant_name: r.restaurant.restaurant_name, // 가게 이름 포함
        rating: r.rating,
        content: r.content,
        created_at: r.created_at,
      })),
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};