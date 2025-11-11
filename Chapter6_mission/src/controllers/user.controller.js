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

    // 성공 응답
    res.status(StatusCodes.CREATED).json({
      message: "회원가입이 완료되었습니다.",
      data: user,
    });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "회원가입 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};
