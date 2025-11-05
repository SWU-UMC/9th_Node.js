import { prisma } from "../db.config.js";

// 레스토랑 추가
export const addRestaurant = async ({ restaurant_name, restaurant_address, latitude, longitude }) => {
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        restaurant_name,
        restaurant_address,
        latitude,
        longitude,
      },
    });
    return restaurant.restaurant_id;
  } catch (err) {
    console.error("레스토랑 추가 중 에러: ", err);
    throw err;
  }
};

// 특정 레스토랑 조회
export const getRestaurantById = async (id) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {restaurant_id: Number(id)},
    });
    return restaurant
  } catch (err) {
    console.error("특정 레스토랑 조회 중 에러: ",  err);
    throw err;
  }
};

export const getAllRestaurantReviews = async (restaurant_id, cursor) => {
  const reviews = await prisma.userRestaurantReview.findMany({
    select: { id: true, content: true, restaurant: true, user: true },
    where: { restaurant_id: restaurant_id, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};