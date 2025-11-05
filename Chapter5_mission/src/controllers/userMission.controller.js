// src/controllers/userMission.controller.js
import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/userMission.service.js";

export const handleChallengeMission = async (req, res) => {
  console.log("미션 도전 요청:", req.params.mission_id, req.body);

  const missionId = parseInt(req.params.mission_id);
  const userId = req.body.user_id;

  try {
    const challenge = await challengeMission(userId, missionId);
    res.status(StatusCodes.OK).json({
      message: "미션 도전이 시작되었습니다.",
      result: challenge,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};