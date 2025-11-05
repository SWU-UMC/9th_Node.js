// src/controllers/mission.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission } from "../services/mission.service.js";
import { listMissionsByStore } from "../services/mission.service.js";

// 미션 등록
export const handleAddMission = async (req, res) => {
  const { storeId } = req.params;

  console.log("미션 등록 요청:", req.body);

  try {
    const missionData = bodyToMission(req.body, storeId);
    const mission = await createMission(missionData);

    res.status(StatusCodes.CREATED).json({
      message: "미션이 성공적으로 등록되었습니다.",
      result: mission,
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: err.message,
    });
  }
};

// 특정 가게의 미션 목록 조회
export const handleListMissionsByStore = async (req, res) => {
  try {
    const storeId = parseInt(req.params.store_id);

    const missions = await listMissionsByStore(storeId);

    res.status(StatusCodes.OK).json({
      message: "가게의 미션 목록을 성공적으로 조회했습니다.",
      result: missions,
    });
  } catch (err) {
    console.error("미션 목록 조회 오류:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err.message,
    });
  }
};