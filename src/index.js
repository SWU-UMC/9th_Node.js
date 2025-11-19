// src/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";          // 추가함.  -> m install morgan cookie-parser 실습
import cookieParser from "cookie-parser";  // 추가

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js"; // ← src 바깥의 swagger.js 불러오기

// .env 로드
dotenv.config();

const app = express();

app.use(morgan("dev"));         // 요청 로그 콘솔 출력
app.use(cookieParser());        // 쿠키 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*공용 응답 헬퍼 등록 -> 워크북 참고함. */
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

  

// 라우터 import
import regionRouter from "./controllers/region.controller.js";
import reviewRouter from "./controllers/review.controller.js";
import missionRouter from "./controllers/mission.controller.js";
import userMissionRouter from "./controllers/user_mission.controller.js";
import userRouter from "./controllers/user.controller.js";

// 라우터 등록
app.use("/api", regionRouter);
app.use("/api", reviewRouter);
app.use("/api", missionRouter);
app.use("/api", userMissionRouter);
app.use("/api", userRouter);

/* 전역 오류 처리 미들웨어 추가함. 모든 오류 통합 처리. 쉽게 말해 500번대 응답 통일 */
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
  
    res.status(err.statusCode || 500).error({
      errorCode: err.errorCode || "unknown",
      reason: err.reason || err.message || "서버 내부 오류",
      data: err.data || null,
    });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

