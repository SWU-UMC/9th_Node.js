import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      resultType: "FAIL",
      error: {
        errorCode: "AUTH001",
        reason: "인증이 필요한 요청입니다. Authorization 헤더가 없습니다.",
        data: null
      },
      success: null
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id: 1, email: "...", iat..., exp... }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      resultType: "FAIL",
      error: {
        errorCode: "AUTH002",
        reason: "유효하지 않은 토큰입니다.",
        data: null
      },
      success: null
    });
  }
};