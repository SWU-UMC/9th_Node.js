export const bodyToMission = (body, storeIdFromPath) => {
  const storeId = Number(storeIdFromPath);
  const reward = Number(body.reward);

  if (!Number.isFinite(storeId) || storeId <= 0) {
    throw new Error("유효하지 않은 storeId 입니다.");
  }
  if (!Number.isFinite(reward) || reward <= 0) {
    throw new Error("reward는 양의 숫자여야 합니다.");
  }

  let deadline = (body.deadline ?? "").trim();
  if (!deadline) deadline = null;
  else if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    deadline = `${deadline} 23:59:59`;
  } else if (!/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(deadline)) {
    throw new Error(
      "deadline 형식이 올바르지 않습니다. (YYYY-MM-DD 또는 YYYY-MM-DD HH:MM:SS)"
    );
  }

  const missionSpec = (body.missionSpec ?? "").toString().trim();
  if (!missionSpec) throw new Error("missionSpec은 필수입니다.");

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
