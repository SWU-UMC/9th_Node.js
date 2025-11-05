// src/repositories/mission.repository.js
import { prisma } from "../db.config.js";

export const findRestaurantById = async (restaurantId) => {
  return await prisma.restaurant.findUnique({
    where: { restaurant_id: Number(restaurantId) },
  });
};

export const createMission = async (restaurantId, data) => {
  return await prisma.mission.create({
    data: {
      restaurant_id: Number(restaurantId),
      mission_title: data.mission_title,
      mission_detail: data.mission_detail,
      reward_point: data.reward_point,
    },
  });
};