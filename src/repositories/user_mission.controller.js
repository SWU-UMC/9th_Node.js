import { prisma } from "../db.config.js";

// 미션 도전 시작
export const startUserMission = async (userId, missionId) => {
  return await prisma.user_mission.create({
    data: {
      user_id: Number(userId),
      mission_id: Number(missionId),
      status: "in_progress",
    },
  });
};

// 미션 완료 + 포인트 지급
export const completeUserMission = async (userMissionId) => {
  // 미션 상태 변경
  const updated = await prisma.user_mission.update({
    where: { user_mission_id: Number(userMissionId) },
    data: { status: "completed", completed_at: new Date() },
    include: {
      mission: true, // reward_point 확인용
    },
  });

  // 포인트 적립
  await prisma.point.create({
    data: {
      user_id: updated.user_id,
      point_value: updated.mission.reward_point,
      description: "미션 완료 보상",
    },
  });

  return updated;
};