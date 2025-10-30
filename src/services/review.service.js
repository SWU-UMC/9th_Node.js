import { responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReviewById } from "../repositories/review.repository.js";

import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { getUser } from "../repositories/user.repository.js"; // (선택 사항이지만 권장)

export const createReview = async (data) => {
  
  // 가게 존재 여부 검증
  const restaurant = await getRestaurantById(data.restaurantId);
  if (restaurant === null) {
    throw new Error(`[Validation Error] 존재하지 않는 가게입니다. (ID: ${data.restaurantId})`);
  }

  // 사용자 존재 여부 검증 
  const user = await getUser(data.userId);
  if (user === null) {
     throw new Error(`[Validation Error] 존재하지 않는 사용자입니다. (ID: ${data.userId})`);
  }

  // 검증 통과 후 리뷰 추가 
  const newReviewId = await addReview({
    userId: data.userId,
    restaurantId: data.restaurantId,
    content: data.content,
    rating: data.rating,
  });

  // 추가한 리뷰 정보 조회
  const newReview = await getReviewById(newReviewId);
  
  if (newReview === null) {
      throw new Error("리뷰 정보를 조회하는 데 실패했습니다.");
  }
  return responseFromReview(newReview);
};