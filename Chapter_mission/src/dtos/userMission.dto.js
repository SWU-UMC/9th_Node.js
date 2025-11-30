// src/dtos/userMission.dto.js

import { createBadRequestError } from "../error.js";

export const bodyToUserMission = (userId, missionId) => {
  if (!missionId || typeof missionId !== "number" || missionId <= 0) {
    throw createBadRequestError("유효한 missionId가 필요합니다.", { missionId });
  }

  if (!userId || typeof userId !== "number" || userId <= 0) {
    throw createBadRequestError("유효한 userId가 필요합니다.", { userId });
  }

  return {
    userId,
    missionId,
  };
};

export const responseFromUserMission = (userMission) => {
  if (!userMission) return null;

  return {
    id: userMission.id,
    userId: userMission.userId,
    missionId: userMission.missionId,
    status: userMission.status,
    createdAt: userMission.createdAt,
    updatedAt: userMission.updatedAt,
  };
};