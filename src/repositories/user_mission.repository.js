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
  // 1️⃣ 미션 상태 변경 및 관련 데이터 포함
  const updated = await prisma.user_mission.update({
    where: { user_mission_id: Number(userMissionId) },
    data: {
      status: "completed",
      completed_at: new Date(),
    },
    include: {
      user: true,      
      mission: true,   
    },
  });

  // 포인트 중복 방지.
  if (updated.status === "completed") {
    const alreadyRewarded = await prisma.point.findFirst({
      where: {
        user_id: updated.user_id,
        description: {
          contains: `미션 ${updated.mission_id} 완료`,
        },
      },
    });
    if (alreadyRewarded) {
      console.log("⚠️ 이미 포인트 지급된 미션입니다.");
      return updated;
    }
  }

  //사용자 포인트 지급
  await prisma.point.create({
    data: {
      user_id: updated.user_id,
      point_value: updated.mission.reward_point,
      description: `미션 ${updated.mission_id} 완료 보상`,
    },
  });

  return updated;
};
/**
 * 진행 중인 미션 목록 조회
 * @param {number} userId
 */
export const listInProgressMissionsByUser = async (userId) => {
  return await prisma.user_mission.findMany({
    where: {
      user_id: Number(userId),
      status: "in_progress",
    },
    orderBy: { started_at: "asc" },
    select: {
      user_id: true,
      started_at: true,
      mission: {
        select: {
          mission_id: true,
          mission_title: true,
          mission_detail: true,
          reward_point: true,
          restaurant: {
            select: {
              restaurant_name: true,
              region_id: true,
            },
          },
        },
      },
    },
  });
};

