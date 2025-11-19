// src/controllers/mission.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission } from "../services/mission.service.js";
import { listMissionsByStore } from "../services/mission.service.js";

// 미션 등록
export const handleAddMission = async (req, res, next) => {
  const { storeId } = req.params;

  console.log("미션 등록 요청:", req.body);

  try {
    const missionData = bodyToMission(req.body, storeId);
    const mission = await createMission(missionData);

    res.status(StatusCodes.CREATED).success(mission);
  } catch (error) {
    next(error);
  }
};

// 특정 가게의 미션 목록 조회
export const handleListMissionsByStore = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.store_id);

    const missions = await listMissionsByStore(storeId);

    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};