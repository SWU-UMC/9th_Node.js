// src/dtos/userMission.dto.js

export const bodyToUserMission = (body, missionId) => {
  return {
    userId: body.user_id,
    missionId: missionId,
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