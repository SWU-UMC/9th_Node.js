import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  console.log("리뷰 추가를 요청했습니다");
  console.log("params (restaurantId):", req.params);
  console.log("body (userId, content, rating):", req.body);

  try {
    const reviewData = bodyToReview(req.body, req.params);

    const newReview = await createReview(reviewData);

    res.status(StatusCodes.CREATED).json({ result: newReview });

  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};