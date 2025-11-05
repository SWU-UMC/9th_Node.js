// src/controllers/review.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { createReview } from "../services/review.service.js";

export const handleAddReview = async (req, res) => {
  const { store_id } = req.params;

  console.log("리뷰 등록 요청:", req.body);

  try {
    const reviewData = bodyToReview(req.body, store_id);
    const review = await createReview(reviewData);

    res.status(StatusCodes.CREATED).json({
      message: "리뷰가 성공적으로 등록되었습니다.",
      result: review,
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message,
    });
  }
};