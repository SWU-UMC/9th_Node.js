export const bodyToReview = (body, params) => {
 
  return {
    userId: body.userId, 
    restaurantId: params.restaurantId, 
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
    createdAt: data.created_at,
  };
};