// src/services/userMission.service.js
import {
  findActiveChallenge,
  addUserMission,
  getUserMissionById,
} from "../repositories/userMission.repository.js";
import { responseFromUserMission } from "../dtos/userMission.dto.js";

export const challengeMission = async (userId, missionId) => {
  // 이미 도전 중인지 확인
  const existing = await findActiveChallenge(userId, missionId);
  if (existing) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  // 도전 시작
  const newChallengeId = await addUserMission(userId, missionId);

  // 결과 반환
  const challenge = await getUserMissionById(newChallengeId);
  return responseFromUserMission(challenge);
};