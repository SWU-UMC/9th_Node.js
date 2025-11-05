// src/controllers/mission.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission } from "../services/mission.service.js";

export const handleAddMission = async (req, res) => {
  const { store_id } = req.params;

  console.log("미션 등록 요청:", req.body);

  try {
    const missionData = bodyToMission(req.body, store_id);
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