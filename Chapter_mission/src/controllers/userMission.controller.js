// src/controllers/userMission.controller.js
import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/userMission.service.js";
import { listActiveMissions } from "../services/userMission.service.js";
import { completeUserMission } from "../services/userMission.service.js";

// 미션 도전
export const handleChallengeMission = async (req, res, next) => {
  console.log("미션 도전 요청:", req.params.missionId, req.body);

  const missionId = Number(req.params.mission_id);
  const userId = Number(req.body.user_id);

  try {
    const challenge = await challengeMission(userId, missionId);
    res.status(StatusCodes.CREATED).success(challenge);
  } catch (error) {
    next(error);
  }
};

// 내가 진행 중인 미션 목록 조회
export const handleListActiveMissions = async (req, res, next) => {
  const userId = Number(req.params.user_id);

  try {
    const result = await listActiveMissions(userId);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 미션 완료
export const handleCompleteMission = async (req, res, next) => {
  const userMissionId = parseInt(req.params.user_mission_id);

  console.log("미션 완료 요청:", userMissionId);

  try {
    const result = await completeUserMission(userMissionId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};