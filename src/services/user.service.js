import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";
import { prisma } from "../db.config.js";
import { DuplicateUserEmailError } from "../errors.js";

export const userSignUp = async (data) => {
  // 비밀번호 검증
  const pwd = (data.password ?? "").toString().trim();
  if (!pwd) {
    throw new Error("비밀번호는 필수입니다.");
  }

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
      throw new Error("존재하지 않는 카테고리가 포함되어 있습니다.");
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

  return responseFromUser(user, preferences);
};
