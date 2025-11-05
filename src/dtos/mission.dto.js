export const bodyToMission = (body) => {

  return {
    restaurant_id: body.restaurant_id, //필수
    title: body.title,
    description: body.description,
    reward: body.reward 
  };
};

export const responseFromMission = (mission) => {
    if(!mission) return null;

    const missionData = mission;

  return {
    mission_id: missionData.mission_id,
    restaurant_id: missionData.restaurant_id,
    title: missionData.title,
    description: missionData.description,
    reward: missionData.reward
  };
};