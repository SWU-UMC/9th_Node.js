import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import bcrypt from "bcrypt";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입 요청이 들어왔습니다!");
  console.log("body:", req.body);

  try {
    // 요청 Body 정제
    const userData = bodyToUser(req.body);

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // 서비스 레이어 호출
    const user = await userSignUp(userData);

    res.status(StatusCodes.CREATED).success(user); // 성공 응답
  } catch (error) {
    next(error); // 실패 응답 전역 에러 핸들러
  }
};
