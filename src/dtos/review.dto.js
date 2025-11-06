export const bodyToReview = (body) => {

  return {
    mission_id: body.mission_id, //필수
    restaurant_id: body.restaurant_id,
    user_id: body.user_id,
    content: body.content,
    rating: body.rating,
    photo: body.photo
  };
};

export const responseFromReview = (review) => {
    if(!review) return null;

    const ReviewData = review;
  return {
    id: ReviewData.id,
    mission_id: ReviewData.mission_id,
    restaurant_id: ReviewData.restaurant_id,
    user_id: ReviewData.user_id,
    content: ReviewData.content,
    rating: ReviewData.rating,
    photo: ReviewData.photo
  };
};