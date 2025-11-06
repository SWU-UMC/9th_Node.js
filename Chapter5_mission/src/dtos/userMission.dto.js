// src/dtos/userMission.dto.js

export const bodyToUserMission = (body, missionId) => {
  return {
    user_id: body.user_id,
    mission_id: missionId,
  };
};

export const responseFromUserMission = (userMission) => {
  if (!userMission) return null;

  return {
    id: userMission.id,
    user_id: userMission.user_id,
    mission_id: userMission.mission_id,
    status: userMission.status,
    created_at: userMission.created_at,
  };
};