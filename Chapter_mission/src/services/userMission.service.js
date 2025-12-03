// src/services/userMission.service.js
import {
  findActiveChallenge,
  addUserMission,
  getUserMissionById,
  findActiveMissionsByUserId,
  updateUserMissionStatus,
} from "../repositories/userMission.repository.js";
import { responseFromUserMission } from "../dtos/userMission.dto.js";
import {
  MissionAlreadyCompletedError,
  MissionAlreadyInProgressError,
  MissionNotFoundError,
} from "../error.js";
import { MissionStatus } from "@prisma/client";
import { ForbiddenError } from "../error.js";

// 미션 도전
export const challengeMission = async ({ userId, missionId }) => {
  // 이미 도전 중인지 확인
  const existing = await findActiveChallenge(userId, missionId);
  if (existing) {
    throw new MissionAlreadyInProgressError("이미 도전 중인 미션입니다.");
  }

  // 유저 미션 생성
  const challenge = await addUserMission(userId, missionId);

  // DTO로 응답 정제
  return responseFromUserMission(challenge);
};

// 내가 진행 중인 미션 목록
export const listActiveMissions = async (userId) => {
  const missions = await findActiveMissionsByUserId(userId);

  return missions.map((m) => ({
    id: m.id,
    missionId: m.mission.id,
    missionTitle: m.mission.title,
    storeName: m.mission.store.name,
    storeAddress: m.mission.store.address,
    status: m.status,
    startedAt: m.createdAt,
  }));
};

// 미션 완료
export const completeUserMission = async (userId, userMissionId) => {
  const mission = await getUserMissionById(userMissionId);

  if (!mission) {
    throw new MissionNotFoundError("해당 미션 도전 정보를 찾을 수 없습니다.", {
      userMissionId,
    });
  }

  // 소유권 검사
  if (String(mission.userId) !== String(userId)) {
    throw new ForbiddenError("본인의 미션만 완료할 수 있습니다.", {
      userMissionId,
      ownerUserId: String(mission.userId),
      requesterId: String(userId),
    });
  }

  if (mission.status === MissionStatus.COMPLETED) {
    throw new MissionAlreadyCompletedError("이미 완료된 미션입니다.", {
      userMissionId,
    });
  }

  const updated = await updateUserMissionStatus(
    userMissionId,
    MissionStatus.COMPLETED
  );

  return responseFromUserMission(updated);
};