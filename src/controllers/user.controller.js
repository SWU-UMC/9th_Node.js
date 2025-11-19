import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);
    console.log("REQ BODY preferences:", req.body?.preferences);

    const dto = bodyToUser(req.body);
    console.log("DTO preferences:", dto.preferences);

    const user = await userSignUp(dto);
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
};
