import { getAllStoreReviews } from "../repository/review.repository.js";
import { responseFromReviews } from "../dto/review.dto.js";

export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};