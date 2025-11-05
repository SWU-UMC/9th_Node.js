// src/dtos/mission.dto.js

export const bodyToMission = (body, storeId) => {
  return {
    storeId,
    title: body.title,
    description: body.description || null,
    point: body.point || 0,
    deadline: body.deadline ? new Date(body.deadline) : null,
  };
};

export const responseFromMission = (mission) => {
  if (!mission) return null;

  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    deadline: mission.deadline,
    createdAt: mission.created_at,
    updatedAt: mission.updated_at,
    storeId: mission.store_id,
  };
};