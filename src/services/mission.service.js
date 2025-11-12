import { bodyToMission, responseFromMissions } from "../dtos/mission.dto.js";
import {
  addMission,
  findMissionsByStore,
  findUserMissions,
  getMissionById,
} from "../repositories/mission.repository.js";
import { ensureStoreExists } from "./store.service.js";
import {
  addUserMission,
  completeUserMission,
  findUserMission,
} from "../repositories/userMission.repository.js";
import { getFirstUserId } from "../repositories/common.repository.js";
import {
  AlreadyChallengedMissionError,
  AlreadyCompletedMissionError,
  ConflictError,
  MissionNotFoundError,
  UserNotFoundError,
  ValidationError,
} from "../errors.js";
import { ensureCursorTake, ensureNumber } from "../utils/validation.js";

// 가게에 미션 추가
export const addMissionToStore = async (rawBody, storeIdFromPath) => {
  const data = bodyToMission(rawBody, storeIdFromPath);

  await ensureStoreExists(data.storeId);

  const mission = await addMission(data);
  return mission;
};

// 미션 도전
export const challengeMission = async (missionIdFromPath) => {
  const missionId = ensureNumber(missionIdFromPath, "missionId");

  const mission = await getMissionById(missionId);
  if (!mission) throw new MissionNotFoundError(missionId);

  // 현재 인증 미구현이라 첫 사용자로 대체
  const userId = await getFirstUserId();
  if (!userId) {
    throw new UserNotFoundError(
      undefined,
      "사용자가 없습니다. 먼저 회원가입을 진행하세요."
    );
  }

  const existing = await findUserMission(userId, missionId);
  if (existing) {
    if (existing.status === "IN_PROGRESS") {
      throw new AlreadyChallengedMissionError(missionId, userId);
    }
    if (existing.status === "COMPLETED") {
      throw new AlreadyCompletedMissionError(missionId, userId);
    }
    throw new AlreadyChallengedMissionError(missionId, userId);
  }

  const um = await addUserMission({ userId, missionId });
  return um;
};

// 특정 가게의 미션 목록 조회
export const listStoreMissions = async (storeIdFromPath, cursor, take) => {
  const storeId = ensureNumber(storeIdFromPath, "storeId");
  const { cursor: c, take: t } = ensureCursorTake(cursor, take);

  await ensureStoreExists(storeId);

  const missions = await findMissionsByStore({ storeId, cursor: c, take: t });

  // 데이터 변환
  const data = missions.map((mission) => ({
    id: mission.id,
    storeId: mission.storeId,
    reward: mission.reward,
    deadline: mission.deadline,
    missionSpec: mission.missionSpec,
    createdAt: mission.createdAt,
    updatedAt: mission.updatedAt,
  }));

  return responseFromMissions(data);
};

// 특정 유저의 진행 중인 미션 목록 조회
export const listUserMissions = async (
  userIdFromPath,
  cursor = 0,
  take = 5
) => {
  const userId = ensureNumber(userIdFromPath, "userId");
  const { cursor: c, take: t } = ensureCursorTake(cursor, take);
  const missions = await findUserMissions(userId, "IN_PROGRESS", c, t);
  return missions;
};

// 진행 중인 미션 완료 처리
export const markMissionCompleted = async (
  userIdFromPath,
  missionIdFromPath
) => {
  const userId = ensureNumber(userIdFromPath, "userId");
  const missionId = ensureNumber(missionIdFromPath, "missionId");

  const um = await findUserMission(userId, missionId);
  if (!um) {
    throw new ConflictError("해당 유저의 미션 도전 기록이 없습니다.", {
      userId,
      missionId,
    });
  }

  if (um.status === "COMPLETED") {
    throw new AlreadyCompletedMissionError(missionId, userId);
  }
  if (um.status !== "IN_PROGRESS") {
    throw new ConflictError("진행 중이 아니라 완료로 변경할 수 없습니다.", {
      userId,
      missionId,
      status: um.status,
    });
  }

  const updated = await completeUserMission(userId, missionId);
  return updated;
};
