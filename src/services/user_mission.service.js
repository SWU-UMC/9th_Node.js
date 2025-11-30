import {
  findUserByMission,
  createUserMission,
  getUserMissionById,
  getOngoingMissions
} from "../repositories/user_mission.repository.js";

import { getMissionById, } from "../repositories/mission.repository.js";
import { responseFromUserMission } from "../dtos/user_mission.dto.js";
import { ResourceNotFoundError, InvalidInputError } from "../errors.js";

export const startMission = async (user_id, mission_id) => {
    //미션이 존재하는지 확인
    const mission = await getMissionById(mission_id);
    if(!mission) {
        throw new ResourceNotFoundError ("해당 미션이 존재하지 않습니다.")
    }

    const existingChallenge = await findUserByMission(
        user_id,
        mission_id
    );
    if (existingChallenge) {
        throw new InvalidInputError ("이미 도전 중이거나 완료한 미션입니다.");
    }

    const challengeDate = {
        mission_id: mission_id,
        user_id: user_id,
        restaurant_id: mission.restaurant_id,
    };

    //도전 중 미션 생성
    const completed_id = await createUserMission(challengeDate);
    const newUserMission = await getUserMissionById(completed_id);
    return responseFromUserMission(newUserMission);
};

//진행 중인 미션 조회
export const getOngoingMissionsService = async (user_id, cursor = 0, limit = 5) => {
  const result = await getOngoingMissions(user_id, cursor, limit);
  const missionsDto = result.missions.map(userMission => {
      return responseFromMission(userMission.mission);
  });

  return {
    missions: missionsDto,
    nextCursor: result.nextCursor,
  };
};