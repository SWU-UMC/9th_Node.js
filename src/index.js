
//기본 서버 구동 src/index.js

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// 라우터 연결
const regionRouter = require("./controllers/region.controller");
const reviewRouter = require("./controllers/review.controller");
const missionRouter = require("./controllers/mission.controller");
const userMissionRouter = require("./controllers/user_mission.controller");

app.use("/api", regionRouter);
app.use("/api", reviewRouter);
app.use("/api", missionRouter);
app.use("/api", userMissionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));