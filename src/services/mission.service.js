import { bodyToMission } from "../dtos/mission.dto.js";
import {
  addMission,
  getMissionById,
} from "../repositories/mission.repository.js";
import { ensureStoreExists } from "./store.service.js";
import {
  addUserMission,
  existsUserMission,
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
