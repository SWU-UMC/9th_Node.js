export const bodyToRestaurant = (body) => {

  return {
    restaurant_name: body.restaurant_name, //필수
    restaurant_address: body.restaurant_address,
    latitude: body.latitude,
    longitude: body.longitude 
  };
};

export const responseFromRestaurant = (restaurant) => {
    if(!restaurant) return null;

    const restaurantData = Array.isArray(restaurant) ? restaurant[0] :restaurant;

  return {
    id: restaurantData.id,
    name: restaurantData.restaurant_name,
    address: restaurantData.restaurant_address,
    latitude: restaurantData.latitude,
    longitude: restaurantData.longitude,
    createdAt: restaurantData.created_at,
    updatedAt: restaurantData.updated_at
  };
};