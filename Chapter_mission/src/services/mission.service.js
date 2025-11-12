// src/services/mission.service.js
import { addMission,
        getMissionsByStoreId,
        getStoreById } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";
import { responseFromMissions } from "../dtos/mission.dto.js";

// 미션 생성
export const createMission = async (missionData) => {
  const store = await getStoreById(missionData.storeId);
  if (!store) throw new StoreNotFoundError("해당 가게가 존재하지 않습니다.");
  const mission = await addMission(missionData);
  return responseFromMission(mission);
};

// 특정 가게의 미션 목록 조회
export const listMissionsByStore = async (storeId) => {
  const missions = await getMissionsByStoreId(storeId);
  return responseFromMissions(missions);
};