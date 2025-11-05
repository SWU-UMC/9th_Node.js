// src/services/review.service.js
import { addReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";

export const createReview = async (reviewData) => {
  const review = await addReview(reviewData);
  return responseFromReview(review);
};