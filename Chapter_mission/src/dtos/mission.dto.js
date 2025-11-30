// src/dtos/mission.dto.js

import { createBadRequestError } from "../error.js";

export const bodyToMission = (body, storeId) => {
  // storeId 검증
  if (!storeId || typeof storeId !== "number" || storeId <= 0) {
    throw createBadRequestError("유효한 storeId가 필요합니다.", { storeId });
  }

  // title: 필수, 문자열 공백 제거 후 최소 한 글자
  if (
    typeof body.title !== "string" ||
    body.title.trim().length === 0
  ) {
    throw createBadRequestError("title은 비어있지 않은 문자열이어야 합니다.");
  }

  // description: 선택, 문자열
  if (
    body.description !== undefined &&
    typeof body.description !== "string"
  ) {
    throw createBadRequestError("description은 문자열이어야 합니다.");
  }

  // point: 필수, number 음수 불가
  if (
    body.point === undefined ||
    typeof body.point !== "number" ||
    body.point < 0
  ) {
    throw createBadRequestError("point는 0 이상의 숫자여야 합니다.", {
      point: body.point,
    });
  }

  // deadline: 선택, 날짜 형식 검사
  if (body.deadline !== undefined) {
    const date = new Date(body.deadline);
    if (isNaN(date.getTime())) {
      throw createBadRequestError("deadline은 유효한 날짜 형식이어야 합니다.", {
        deadline: body.deadline,
      });
    }
  }

  return {
    storeId,
    title: body.title.trim(),
    description: body.description?.trim() || null,
    point: body.point,
    deadline: body.deadline ? new Date(body.deadline) : null,
  };
};

export const responseFromMission = (mission) => {
  if (!mission) return null;

  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    deadline: mission.deadline,
    createdAt: mission.createdAt,
    updatedAt: mission.updatedAt,
    storeId: mission.storeId,
  };
};

export const responseFromMissions = (missions) => {
  return missions.map((mission) => ({
    id: mission.id,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    deadline: mission.deadline,
    createdAt: mission.createdAt,
    updatedAt: mission.updatedAt,
  }));
};