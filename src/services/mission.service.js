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
  completeUserMission,
} from "../repositories/mission.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";
import { getUser } from "../repositories/user.repository.js";

import {
  RestaurantNotFoundError,
  MissionNotFoundError,
  UserNotFoundError,
  MissionAlreadyCompletedError,
} from "../error.js";

export const createMission = async (data) => {
  // 가게 존재 여부 검증 
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: data.restaurantId },
  });
  if (restaurant === null) {
    throw new RestaurantNotFoundError(
      `존재하지 않는 가게입니다. (ID: ${data.restaurantId})`
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
    throw new MissionNotFoundError(
      `존재하지 않는 미션입니다. (ID: ${missionId})`
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    throw new UserNotFoundError(
      `존재하지 않는 사용자입니다. (ID: ${userId})`
    );
  }

  const newUserMission = await addUserMission(data);

  return responseFromUserMission(newUserMission);
};

// 미션 완료하기 서비스
export const completeMission = async (userMissionId) => {
  // 해당 도전 내역이 존재하는 지 확인
  const userMission = await getUserMissionById(userMissionId);

  if (!userMission) {
    throw new UserMissionNotFoundError(
      `존재하지 않는 유저 미션입니다. (ID: ${userMissionId})`
    );
  }

  // 이미 완료된 미션인지 확인
  if (userMission.status === "진행완료") {
    throw new MissionAlreadyCompletedError(
      `이미 완료된 미션입니다. (유저미션 ID: ${userMissionId})`
    );  
  }

  // 미션 완료 처리 및 포인트 지급
  const completed = await completeUserMission(
    userMission.id,
    userMission.userId,
    userMission.mission.point
  );

  return responseFromUserMission(completed);
};
