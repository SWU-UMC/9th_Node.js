// src/services/userMission.service.js
import { findActiveChallenge,
        addUserMission,
        //getUserMissionById,
        findActiveMissionsByUserId,
        updateUserMissionStatus, }
        from "../repositories/userMission.repository.js";
import { responseFromUserMission, }
        from "../dtos/userMission.dto.js";

// 미션 도전
export const challengeMission = async (userId, missionId) => {
  // 이미 도전 중인지 확인
  const existing = await findActiveChallenge(userId, missionId);
  if (existing) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  // 결과 반환
  const challenge = await addUserMission(userId, missionId);
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
export const completeUserMission = async (userMissionId) => {
  // 현재 도전 상태 확인
  const mission = await prisma.userMission.findUnique({
    where: { id: userMissionId },
  });

  if (!mission) {
    throw new Error("해당 미션 도전 정보를 찾을 수 없습니다.");
  }

  if (mission.status === "COMPLETED") {
    throw new Error("이미 완료된 미션입니다.");
  }

  // 상태 업데이트
  const updated = await updateUserMissionStatus(userMissionId, "COMPLETED");

  // 응답 반환
  return responseFromUserMission(updated);
};