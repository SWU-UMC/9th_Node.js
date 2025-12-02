// src/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
 

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";

// .env 로드
dotenv.config();

const app = express();

 //  공용 응답 헬퍼

 app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({
      resultType: "SUCCESS",
      error: null,
      success,
    });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});


//공용 미들웨어

app.use(cors());                     // CORS 허용
app.use(express.static("public"));   // 정적 파일 접근
app.use(morgan("dev"));              // 요청 로그 출력
app.use(cookieParser());             // 쿠키 파싱
app.use(express.json());             // JSON 파싱
app.use(express.urlencoded({ extended: false })); // form 데이터 파싱

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Passport 설정
import { googleStrategy, jwtStrategy } from "./auth.config.js";  // 전략 import
passport.use(googleStrategy);                       // 전략 등록
passport.use(jwtStrategy);  

app.use(passport.initialize());                     // passport 초기화


//Google OAuth 라우트


// Google 로그인 페이지로 이동
app.get(
  "/oauth2/login/google",
  passport.authenticate("google", { session: false })
);

//Google 로그인 후 callback 처리
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user;

    return res.success({
      message: "Google 로그인 성공!",
      tokens,
    });
  }
);

// jwt 보호 라우트
const isLogin = passport.authenticate("jwt", { session: false });

app.get("/mypage", isLogin, (req, res) => {
  return res.success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

//api 라우터

import regionRouter from "./controllers/region.controller.js";
import reviewRouter from "./controllers/review.controller.js";
import missionRouter from "./controllers/mission.controller.js";
import userMissionRouter from "./controllers/user_mission.controller.js";
import userRouter from "./controllers/user.controller.js";

app.use("/api", regionRouter);
app.use("/api", reviewRouter);
app.use("/api", missionRouter);
app.use("/api", userMissionRouter);
app.use("/api", userRouter);

/* ==============================
   전역 오류 처리
============================== */
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  return res.error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || "서버 내부 오류",
    data: err.data || null,
  });
});

/* ==============================
   서버 실행
============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
