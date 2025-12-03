// src/repositories/userMission.repository.js
import { prisma } from "../db.config.js";

/**
 * JS number / string / bigint 형태로 받은 id를
 * Prisma BigInt 컬럼에 안전하게 넣기 위해 BigInt로 변환하는 헬퍼
 */
const toBigInt = (value, fieldName = "id") => {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName}가 필요합니다.`);
  }

  // 이미 BigInt면 그대로 사용
  if (typeof value === "bigint") {
    return value;
  }

  // number인 경우: 정수인지 확인 후 BigInt로 변환
  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      throw new Error(`${fieldName}는 정수여야 합니다.`);
    }
    return BigInt(value);
  }

  // string인 경우: 공백 제거 후 숫자로 변환 가능해야 함
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0 || Number.isNaN(Number(trimmed))) {
      throw new Error(`${fieldName}는 숫자 형태의 문자열이어야 합니다.`);
    }
    return BigInt(trimmed);
  }

  throw new Error(`${fieldName}는 정수 또는 정수 형태의 문자열이어야 합니다.`);
};

// 이미 도전 중인지 확인
export const findActiveChallenge = async (userId, missionId) => {
  return await prisma.userMission.findFirst({
    where: {
      userId: toBigInt(userId, "userId"),
      missionId: toBigInt(missionId, "missionId"),
      status: "IN_PROGRESS",
    },
  });
};

// 도전 시작 (user_mission 생성)
export const addUserMission = async (userId, missionId) => {
  return await prisma.userMission.create({
    data: {
      userId: toBigInt(userId, "userId"),
      missionId: toBigInt(missionId, "missionId"),
      status: "IN_PROGRESS",
    },
  });
};

// user_mission 단건 조회
export const getUserMissionById = async (userMissionId) => {
  return await prisma.userMission.findUnique({
    where: { id: toBigInt(userMissionId, "userMissionId") },
  });
};

// 특정 유저의 진행 중(IN_PROGRESS) 미션 목록 조회
export const findActiveMissionsByUserId = async (userId) => {
  return await prisma.userMission.findMany({
    where: {
      userId: toBigInt(userId, "userId"),
      status: "IN_PROGRESS",
    },
    include: {
      mission: {
        include: {
          store: {
            select: { id: true, name: true, address: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// 미션 상태 업데이트
export const updateUserMissionStatus = async (userMissionId, newStatus) => {
  return await prisma.userMission.update({
    where: { id: toBigInt(userMissionId, "userMissionId") },
    data: { status: newStatus },
  });
};