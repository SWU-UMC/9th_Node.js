// src/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";          // 추가함.  -> m install morgan cookie-parser 실습
import cookieParser from "cookie-parser";  // 추가

// Swagger
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

// .env 로드
dotenv.config();

const app = express();

app.use(morgan("dev"));         // 요청 로그 콘솔 출력
app.use(cookieParser());        // 쿠키 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

  app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup({}, {
      swaggerOptions: {
        url: "/openapi.json",
      },
    })
  );
  
  app.get("/openapi.json", async (req, res, next) => {
    // #swagger.ignore = true
    const options = {
      openapi: "3.0.0",
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
    const routes = [
      "./src/index.js",
      "./src/controllers/region.controller.js",
      "./src/controllers/review.controller.js",
      "./src/controllers/mission.controller.js",
      "./src/controllers/user_mission.controller.js",
      "./src/controllers/user.controller.js"
    ];
    const doc = {
      info: {
        title: "UMC 9th",
        description: "UMC 9th Node.js 테스트 프로젝트입니다.",
      },
      host: "localhost:3000",
    };
  
    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
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

