import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  const data = bodyToUser(req.body);
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(data); // 👈 data를 서비스로 전달
  res.status(StatusCodes.OK).json({ result: user });
};