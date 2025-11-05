import { prisma } from "../db.config.js";
import {
  responseFromMission,
  bodyToChallenge,
  responseFromUserMission,
} from "../dtos/mission.dto.js";
import {
  addMission,
  getMissionById,
  checkUserMissionExists, 
  addUserMission,
  getUserMissionById, 
} from "../repositories/mission.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { getUser } from "../repositories/user.repository.js";

export const createMission = async (data) => {
  // 가게 존재 여부 검증 
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: data.restaurantId },
  });
  if (restaurant === null) {
    throw new Error(
      `[Validation Error] 존재하지 않는 가게입니다. (ID: ${data.restaurantId})`
    );
  }

  const newMission = await addMission(data);

  return responseFromMission(newMission);
};

export const challengeMission = async (data) => {
  const { userId, missionId } = data;

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });
  if (mission === null) {
    throw new Error(
      `[Validation Error] 존재하지 않는 미션입니다. (ID: ${missionId})`
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    throw new Error(
      `[Validation Error] 존재하지 않는 사용자입니다. (ID: ${userId})`
    );
  }

  const newUserMission = await addUserMission(data);

  return responseFromUserMission(newUserMission);
};