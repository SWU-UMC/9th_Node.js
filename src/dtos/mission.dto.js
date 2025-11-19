export const bodyToMission = (body, params) => {
  return {
    restaurantId: parseInt(params.restaurantId), // 미션을 추가할 가게 ID 
    point: body.point, // 필수
    content: body.content, // 필수
    deadline: body.deadline ? new Date(body.deadline) : null,
  };
};

export const responseFromMission = (data) => {
  return {
    id: data.id,
    restaurantId: data.restaurant_id,
    point: data.point,
    content: data.content,
    deadline: data.deadline,
    createdAt: data.created_at,
  };
};

// 미션 도전하기 요청 DTO
export const bodyToChallenge = (body, params) => {
  return {
    userId: body.userId,
    missionId: params.missionId, 
  };
};

// 미션 도전하기 응답 DTO 
export const responseFromUserMission = (data) => {
  return {
    id: data.id, 
    userId: data.user_id,
    missionId: data.mission_id,
    status: data.status,
    createdAt: data.created_at,
  };
};

export const paramsToCompleteMission = (params) => {
  return {
    userMissionId: parseInt(params.userMissionId),
  };
};