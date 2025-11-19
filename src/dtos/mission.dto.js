import { ValidationError } from "../errors.js";

export const bodyToMission = (body, storeIdFromPath) => {
  const storeId = Number(storeIdFromPath);
  const reward = Number(body.reward);

  if (!Number.isFinite(storeId) || storeId <= 0) {
    throw new ValidationError("유효하지 않은 storeId 입니다.", { storeId });
  }

  if (!Number.isFinite(reward) || reward <= 0) {
    throw new ValidationError("reward는 양의 숫자여야 합니다.", { reward });
  }

  let deadline = (body.deadline ?? "").trim();
  if (!deadline) {
    deadline = null;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    // 시간 안 정하면 마지막 시각
    deadline = `${deadline} 23:59:59`;
  } else if (!/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(deadline)) {
    throw new ValidationError(
      "deadline 형식이 올바르지 않습니다. (YYYY-MM-DD 또는 YYYY-MM-DD HH:MM:SS)",
      { deadline }
    );
  }

  const missionSpec = (body.missionSpec ?? "").toString().trim();
  if (!missionSpec) {
    throw new ValidationError("missionSpec은 필수입니다.", { missionSpec });
  }

  return { storeId, reward, deadline, missionSpec };
};

export const responseFromMission = (m) => ({
  id: m.id,
  storeId: m.storeId,
  reward: m.reward,
  deadline: m.deadline,
  missionSpec: m.missionSpec,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

export const responseFromUserMission = (um) => ({
  userId: um.userId,
  missionId: um.missionId,
  status: um.status,
  startedAt: um.startedAt,
  completedAt: um.completedAt ?? null,
  createdAt: um.createdAt ?? null,
  updatedAt: um.updatedAt ?? null,
});

export const responseFromMissions = (missions) => ({
  data: missions,
  pagination: {
    cursor: missions.length ? missions[missions.length - 1].id : null,
  },
});
