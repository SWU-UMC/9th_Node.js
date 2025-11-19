import { prisma } from "../db.config.js";

import { responseFromReview } from "../dtos/review.dto.js";
import { addReview, getReviewById } from "../repositories/review.repository.js";

import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { getUser } from "../repositories/user.repository.js"; // (선택 사항이지만 권장)

export const createReview = async (data) => {
  
  // 가게 존재 여부 검증
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: data.restaurantId },
  });
  if (restaurant === null) {
    throw new RestaurantNotFoundError(
      `[Validation Error] 존재하지 않는 가게입니다. (ID: ${data.restaurantId})`
    );
  }

  // 사용자 존재 여부 검증 
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (user === null) {
     throw new UserNotFoundError(
      `[Validation Error] 존재하지 않는 사용자입니다. (ID: ${data.userId})`
    );
  }

  // 검증 통과 후 리뷰 추가 
  const newReview = await addReview(data);
  return responseFromReview(newReview);
};