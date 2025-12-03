export const bodyToReview = (body, params, userId) => {
  return {
    userId: userId, // 컨트롤러에서 넘겨준 토큰 ID 사용

    restaurantId: parseInt(params.restaurantId),
    content: body.content,
    rating: body.rating,
  };
};

export const responseFromReview = (data) => {
  return {
    id: data.id,
    userId: data.user_id,
    restaurantId: data.restaurant_id,
    content: data.content,
    rating: data.rating,
  };
};
