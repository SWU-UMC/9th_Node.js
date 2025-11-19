// import { prisma } from "../prisma/client.js";
// import { responseFromUser } from "../dtos/user.dto.js";
import { prisma } from "../db.config.js";
import { DuplicateUserEmailError } from "../error.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../error.js";

/**
 * 회원가입 서비스 (Prisma 리팩터링 버전)
 * @param {Object} data - 요청 데이터 (비밀번호 암호화된 상태)
 * @returns {Object} 클라이언트에 반환할 유저 데이터
 */
export const userSignUp = async (data) => {
  // 이메일 중복 검사
  const existUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existUser) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  // 유저 생성
  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password, // bcrypt로 암호화된 상태
      name: data.name,
      nickname: data.nickname,
      gender: data.gender,
      birth: data.birth,
      phoneNumber: data.phoneNumber,
      profileImage: data.profileImage || null,
    },
  });

  // DTO로 변환 후 반환
  return responseFromUser(createdUser);
};