import { prisma } from "../db.config.js";

export const addRestaurant = async (data) => {
  try {
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,

        region: {
          connect: { id: data.regionId },
        },
        foodCategory: {
          connect: { id: data.categoryId },
        },
      },
    });
    return newRestaurant.id; 
  } catch (err) {
    if (err.code === 'P2003') {
      throw new Error(`[Validation Error] 존재하지 않는 지역 또는 카테고리 ID입니다.`);
    }
    console.error(err);
    throw new Error(`DB 오류가 발생했습니다: ${err.message}`);
  }
};

export const getRestaurantById = async (restaurantId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      region: true,
      foodCategory: true, 
    },
  });

  return restaurant;
};

export const getAllRestaurantReviews = async (restaurantId, cursor) => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      restaurant: true,
      user: true,
    },
    where : {restaurantId: restaurantId, id: {gt: cursor}},
    orderBy: {id: "asc"},
    take: 5,

  });

  return reviews;
}