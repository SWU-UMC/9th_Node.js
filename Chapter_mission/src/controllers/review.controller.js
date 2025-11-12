// src/controllers/review.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";
import { listStoreReviews } from "../services/review.service.js";
import { listUserReviews } from "../services/review.service.js";

// 리뷰 등록 요청
export const handleAddReview = async (req, res, next) => {
  const { storeId } = req.params;

  console.log("리뷰 등록 요청:", req.body);

  try {
    const reviewData = bodyToReview(req.body, storeId);
    const review = await addReview(reviewData);

    res.status(StatusCodes.CREATED).success(review);
  } catch (error) {
    next(error);
  }
};

// 특정 가게의 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    const result = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 내가 작성한 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const cursor =
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : null;

  try {
    const result = await listUserReviews(userId, cursor);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};