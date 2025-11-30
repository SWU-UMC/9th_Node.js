import {
  findCompletedMission,
  findReviewByMission,
  createReview,
  getReviewById,
  getMyReviews
} from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { DuplicateUserEmailError, InvalidInputError, ResourceNotFoundError } from "../errors.js";

export const reviewAdd = async (user_id, mission_id, body) => {
  //이 유저가 이 미션을 '완료'했는지 확인 (status = 1)
  const completedMission = await findCompletedMission(user_id, mission_id);
  if (!completedMission) {
    throw new InvalidInputError("미션을 완료한 사용자만 리뷰를 작성할 수 있습니다.");
  }

  const restaurantIdFromMission = completedMission.mission.restaurant_id;

  //가게가 존재하는지 확인
  const restaurant = await getRestaurantById(restaurantIdFromMission);
  if(!restaurant) {
    throw new ResourceNotFoundError ("리뷰를 작성하려는 레스토랑이 존재하지 않습니다.")
  }

  //이 미션에 대해 이미 리뷰를 작성했는지 확인 (중복 방지)
  const existingReview = await findReviewByMission(user_id, mission_id);
  if (existingReview) {
    throw new InvalidInputError("이미 이 미션에 대한 리뷰를 작성했습니다.");
  }

  //리뷰 데이터
  const reviewData = {
    mission_id: mission_id,
    restaurant_id: restaurantIdFromMission, 
    user_id: user_id, 
    content: body.content,
    rating: body.rating,
    photo: body.photo,
  };

  //리뷰 생성
  const newReview = await createReview(reviewData);

  return responseFromReview(newReview);
};

export const listMyReviews = async (userId, cursor, limit) => {
  return await getMyReviews(userId, cursor, limit);
};