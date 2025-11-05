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
    // YYYY-MM-DD 만 보내면 23:59:59으로
    deadline = `${deadline} 23:59:59`;
  } else if (!/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(deadline)) {
    throw new Error(
      "deadline 형식이 올바르지 않습니다. (YYYY-MM-DD 또는 YYYY-MM-DD HH:MM:SS)"
    );
  }

  const missionSpec = (body.missionSpec ?? "").toString().trim();
  if (!missionSpec) {
    throw new Error("missionSpec은 필수입니다.");
  }

  return { storeId, reward, deadline, missionSpec };
};

export const responseFromMission = (mission) => ({
  id: mission.id,
  storeId: mission.store_id,
  reward: mission.reward,
  deadline: mission.deadline,
  missionSpec: mission.mission_spec,
  createdAt: mission.created_at,
  updatedAt: mission.updated_at,
});

export const responseFromUserMission = (um) => ({
  userId: um.user_id,
  missionId: um.mission_id,
  status: um.status,
  startedAt: um.started_at,
  completedAt: um.completed_at,
  createdAt: um.created_at ?? null,
  updatedAt: um.updated_at ?? null,
});
