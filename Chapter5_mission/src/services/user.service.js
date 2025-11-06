import { responseFromUser } from "../dtos/user.dto.js";
import { addUser, getUser } from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  // user 추가
  const joinUserId = await addUser({
    email: data.email,
    password: data.password,     // 암호화된 비밀번호
    name: data.name,
    nickname: data.nickname,
    gender: data.gender,
    birth: data.birth,
    phoneNumber: data.phoneNumber,
    profileImage: data.profileImage || null,
  });

  // 중복 이메일 처리
  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // 방금 가입한 사용자 정보 조회
  const user = await getUser(joinUserId);

  // DTO로 변환 후 반환
  return responseFromUser(user);
};
