import { StatusCodes } from "http-status-codes";
import {
  addReviewToStore,
  listMyReviews,
  listReviewsByUserId,
} from "../services/review.service.js";
import { responseFromReview } from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  try {
    const review = await addReviewToStore(req.body, Number(req.params.storeId));
    res.status(StatusCodes.CREATED).success(responseFromReview(review));
  } catch (err) {
    next(err);
  }
};

// 내 리뷰 조회
export const handleListMyReviews = async (req, res, next) => {
  try {
    const userIdFromAuth = null;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listMyReviews(userIdFromAuth, cursor, take);
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};

// 특정 유저 리뷰 조회
export const handleListUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listReviewsByUserId(userId, cursor, take); // ← 교체
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};
