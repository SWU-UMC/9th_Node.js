// src/index.js
import express from "express";
import dotenv from "dotenv";

// .env 로드
dotenv.config();

const app = express();
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