// src/services/mission.service.js
import { addMission } from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";

export const createMission = async (missionData) => {
  const mission = await addMission(missionData);
  return responseFromMission(mission);
};