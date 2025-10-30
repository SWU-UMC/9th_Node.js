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
  
  const restaurant = await getRestaurantById(data.restaurantId);
  if (restaurant === null) {
    throw new Error(`[Validation Error] 존재하지 않는 가게입니다. (ID: ${data.restaurantId})`);
  }

  const newMissionId = await addMission(data);

  const newMission = await getMissionById(newMissionId);
  
  if (newMission === null) {
      throw new Error("미션 정보를 조회하는 데 실패했습니다.");
  }
  return responseFromMission(newMission);
};

export const challengeMission = async (data) => {
  const { userId, missionId } = data;

  const mission = await getMissionById(missionId);
  if (mission === null) {
    throw new Error(
      `[Validation Error] 존재하지 않는 미션입니다. (ID: ${missionId})`
    );
  }

  const user = await getUser(userId);
  if (user === null) {
    throw new Error(
      `[Validation Error] 존재하지 않는 사용자입니다. (ID: ${userId})`
    );
  }

  const isAlreadyChallenging = await checkUserMissionExists(
    userId,
    missionId
  );
  if (isAlreadyChallenging) {
    throw new Error(`[Validation Error] 이미 도전 중인 미션입니다.`);
  }

  const newUserMissionId = await addUserMission(data);

  const newUserMission = await getUserMissionById(newUserMissionId);
  if (newUserMission === null) {
    throw new Error("미션 도전 정보를 조회하는 데 실패했습니다.");
  }

  return responseFromUserMission(newUserMission);
};