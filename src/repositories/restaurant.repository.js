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
    return restaurant;
  } catch (err) {
    console.error("레스토랑 추가 중 에러: ", err);
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
  }
};

//특정 레스토랑의 모든 리뷰 가져오기
export const getAllRestaurantReviews = async (restaurant_id, cursor) => {
  const reviews = await prisma.mission_review.findMany({
    select: { 
      review_id: true, 
      content: true, 
      restaurant: true, 
      user: true },
    where: { 
      restaurant_id: Number(restaurant_id), 
      review_id: { gt: Number(cursor) } },
    orderBy: { review_id: "asc" },
    take: 5,
  });
  const nextCursor = reviews.length > 0 ? reviews[reviews.length - 1].review_id : null;

  return { reviews, nextCursor };
};

//mission-06
//레스토랑 ID로 미션 조회하기
export const getMissionsByRestaurantId = async (restaurant_id, cursor = null, limit = 5) => {
  try {
    const missions = await prisma.mission.findMany({
      where: { restaurant_id: Number(restaurant_id) },
      select: {
        mission_id: true,
        title: true,
        description: true,
        reward: true,
      },
      orderBy: { mission_id: "asc" },
      take: limit,
      ...(cursor && { cursor: { mission_id: Number(cursor) }, skip: 1 }),
    });

    const nextCursor = missions.length > 0 ? missions[missions.length - 1].mission_id : null;

    return { missions, nextCursor };
  } catch (err) {
    console.error("레스토랑 ID로 미션 조회 중 에러:", err);
  }
};
