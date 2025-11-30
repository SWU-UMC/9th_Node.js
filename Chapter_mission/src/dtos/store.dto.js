// src/dtos/store.dto.js

import { createBadRequestError } from "../error.js";

export const bodyToStore = (body, regionId) => {
  if (!regionId || typeof regionId !== "number" || regionId <= 0) {
    throw createBadRequestError("유효한 regionId가 필요합니다.", { regionId });
  }

  // categoryId: 필수, 양의 정수
  if (
    body.categoryId === undefined ||
    typeof body.categoryId !== "number" ||
    body.categoryId <= 0
  ) {
    throw createBadRequestError("categoryId는 1 이상의 정수여야 합니다.", {
      categoryId: body.categoryId,
    });
  }

  // name: 필수, 문자열 공백 제거 후 최소 한 글자
  if (
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    throw createBadRequestError("name은 비어있지 않은 문자열이어야 합니다.");
  }

  // address: 선택값, 문자열인지 확인
  if (
    body.address !== undefined &&
    typeof body.address !== "string"
  ) {
    throw createBadRequestError("address는 문자열이어야 합니다.");
  }

  // description: 선택값, 문자열인지 확인
  if (
    body.description !== undefined &&
    typeof body.description !== "string"
  ) {
    throw createBadRequestError("description은 문자열이어야 합니다.");
  }

  return {
    regionId,
    categoryId: body.categoryId,
    name: body.name.trim(),
    address: body.address?.trim() || null,
    description: body.description?.trim() || null,
  };
};

export const responseFromStore = (store) => {
  if (!store) return null;

  return {
    id: store.id,
    regionId: store.regionId,
    categoryId: store.categoryId,
    name: store.name,
    address: store.address,
    description: store.description,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
};