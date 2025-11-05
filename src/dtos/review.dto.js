export const bodyToReview = (body, params) => {
  return {
    userId: parseInt(body.userId), 
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
