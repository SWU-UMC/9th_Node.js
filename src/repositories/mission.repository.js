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


/**
 * 특정 가게의 미션 목록 조회 (유저 상태 포함)
 * @param {number} restaurantId 
 * @param {number} userId 
 */
export const listMissionsByRestaurant = async (restaurantId, userId) => {
  // region_id는 일단 1로 고정 -> 지역별로 있는데 연습이므로 서울 = 1로 고정함.
  return await prisma.mission.findMany({
    where: { restaurant_id: Number(restaurantId) },
    select: {
      mission_id: true,
      mission_title: true,
      mission_detail: true,
      reward_point: true,
      restaurant: {
        select: {
          restaurant_name: true,
          region_id: true,
        },
      },
      // 현재 사용자(userId)의 미션 진행 상태 - 조인으로 구현
      user_mission: {
        where: { user_id: Number(userId) },
        select: { status: true },
      },
    },
  });
};