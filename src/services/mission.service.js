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
  existsUserMission,
  findUserMission,
} from "../repositories/userMission.repository.js";
import { getFirstUserId } from "../repositories/common.repository.js";

export const addMissionToStore = async (rawBody, storeIdFromPath) => {
  const data = bodyToMission(rawBody, storeIdFromPath);
  if (!data.storeId) throw new Error("storeId는 필수입니다.");
  await ensureStoreExists(data.storeId);

  const mission = await addMission(data);
  return mission;
};

export const challengeMission = async (missionIdFromPath) => {
  const missionId = Number(missionIdFromPath);
  const mission = await getMissionById(missionId);
  if (!mission) throw new Error("존재하지 않는 미션입니다.");

  const userId = await getFirstUserId();
  if (!userId)
    throw new Error("사용자가 없습니다. 먼저 회원가입을 진행하세요.");

  const already = await existsUserMission({ userId, missionId });
  if (already)
    throw new Error("이미 도전 중인(혹은 이전에 등록된) 미션입니다.");

  const um = await addUserMission({ userId, missionId });
  return um;
};

// 특정 가게의 미션 목록 조회
export const listStoreMissions = async (storeId, cursor = 0, take = 5) => {
  const missions = await findMissionsByStore({ storeId, cursor, take });

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
export const listUserMissions = async (userId, cursor = 0, take = 5) => {
  const missions = await findUserMissions(userId, "IN_PROGRESS", cursor, take);

  return missions;
};

export const markMissionCompleted = async (userId, missionId) => {
  const um = await findUserMission(userId, missionId);
  if (!um) {
    throw new Error("해당 유저의 미션 도전 기록이 없습니다.");
  }
  if (um.status !== "IN_PROGRESS") {
    throw new Error("진행 중이 아니라 완료로 변경할 수 없습니다.");
  }
  const updated = await completeUserMission(userId, missionId);
  return updated;
};
