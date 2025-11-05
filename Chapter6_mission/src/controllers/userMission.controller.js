// src/controllers/userMission.controller.js
import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/userMission.service.js";
import { listActiveMissions } from "../services/userMission.service.js";
import { completeUserMission } from "../services/userMission.service.js";

// 미션 도전
export const handleChallengeMission = async (req, res) => {
  console.log("미션 도전 요청:", req.params.mission_id, req.body);

  const missionId = Number(req.params.mission_id);
  const userId = Number(req.body.user_id);

  try {
    const challenge = await challengeMission(userId, missionId);
    res.status(StatusCodes.CREATED).json({
      message: "미션 도전이 시작되었습니다.",
      result: challenge,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// 내가 진행 중인 미션 목록 조회
export const handleListActiveMissions = async (req, res) => {
  const userId = parseInt(req.params.user_id);

  try {
    const result = await listActiveMissions(userId);

    res.status(StatusCodes.OK).json({
      message: "진행 중인 미션 목록 조회 성공",
      result,
    });
  } catch (error) {
    console.error("진행 중인 미션 목록 조회 중 오류:", error.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      error: error.message,
    });
  }
};

// 미션 완료
export const handleCompleteMission = async (req, res) => {
  const userMissionId = parseInt(req.params.userMissionId);

  console.log("미션 완료 요청:", userMissionId);

  try {
    const result = await completeUserMission(userMissionId);
    res.status(StatusCodes.OK).json({
      message: "미션이 완료되었습니다.",
      result,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};