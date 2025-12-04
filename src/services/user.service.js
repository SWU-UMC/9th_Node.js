import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";
import { prisma } from "../db.config.js";
import { DuplicateUserEmailError, ValidationError } from "../errors.js";
import { ensureNumber, ensureString } from "../utils/validation.js";

export const userSignUp = async (data) => {
  // 비밀번호 검증
  const pwd = ensureString(data.password, "비밀번호");

  // preferences 정규화
  const prefs = Array.isArray(data.preferences)
    ? data.preferences.map(Number).filter(Number.isFinite)
    : [];

  // 카테고리 유효성 검증
  if (prefs.length > 0) {
    const ids = prefs.map((id) => BigInt(id));

    const count = await prisma.foodCategory.count({
      where: {
        id: { in: ids },
      },
    });

    if (count !== ids.length) {
      throw new ValidationError("존재하지 않는 카테고리가 포함되어 있습니다.", {
        field: "preferences",
        value: data.preferences,
      });
    }
  }

  // 비밀번호 해싱
  const passwordHash = await bcrypt.hash(pwd, 10);

  // 유저 생성
  const userId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    specAddress: data.detailAddress,
    password: passwordHash,
  });

  if (userId === null) {
    // 이메일 중복
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", {
      email: data.email,
    });
  }

  // 선호 카테고리 저장
  for (const categoryId of prefs) {
    await setPreference(userId, categoryId);
  }

  const user = await getUser(userId);
  const preferences = await getUserPreferencesByUserId(userId);

  return responseFromUser({ user, preferences });
};

export const updateMyProfile = async (userIdFromAuth, body) => {
  const userId = ensureNumber(userIdFromAuth, "userId");

  // 업데이트 가능한 필드만 추출 (부분 수정 허용)
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.gender !== undefined) {
    data.gender = body.gender === "여성" ? 0 : 1;
  }
  if (body.birth !== undefined) {
    data.birth = new Date(body.birth);
  }
  if (body.address !== undefined) data.address = body.address;
  if (body.specAddress !== undefined) data.specAddress = body.specAddress;

  const updated = await prisma.user.update({
    where: { id: BigInt(userId) },
    data,
  });

  return {
    id: Number(updated.id),
    email: updated.email,
    name: updated.name,
    gender: updated.gender,
    birth: updated.birth,
    address: updated.address,
    specAddress: updated.specAddress,
  };
};
