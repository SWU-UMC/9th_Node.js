export const bodyToUserMission = (body) => {

  return {
    mission_id: body.mission_id, //필수
    restaurant_id: body.restaurant_id,
    user_id: body.user_id,
    status: body.status,
    startDate: body.startDate,
    endDate: body.endDate
  };
};

export const responseFromUserMission = (userMission) => {
  if (!userMission) return null;

  return {
    id: userMission.completed_id,
    mission_id: userMission.mission_id,
    user_id: userMission.user_id,
    restaurant_id: userMission.restaurant_id,
    status: userMission.status, // 0 (도전 중)
    startDate: userMission.start_date,
    endDate: userMission.end_date,
  };
};