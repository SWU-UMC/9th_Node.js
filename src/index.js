// src/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";          // 추가함.  -> m install morgan cookie-parser 실습
import cookieParser from "cookie-parser";  // 추가


// .env 로드
dotenv.config();

const app = express();

app.use(morgan("dev"));         // 요청 로그 콘솔 출력
app.use(cookieParser());        // 쿠키 파싱
app.use(express.json());

// 라우터 import
import regionRouter from "./controllers/region.controller.js";
import reviewRouter from "./controllers/review.controller.js";
import missionRouter from "./controllers/mission.controller.js";
import userMissionRouter from "./controllers/user_mission.controller.js";

// 라우터 등록
app.use("/api", regionRouter);
app.use("/api", reviewRouter);
app.use("/api", missionRouter);
app.use("/api", userMissionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));