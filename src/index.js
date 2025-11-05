
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


//워크북과 다른 점은 저는 라우터로 이미 설계해서 컨트롤로에서 export한 함수로 불러오기 방식
//으로 미작성했는데 혹시 이게 불필요한 코드라면, 수정하겠습니다~!
app.use("/api", regionRouter);
app.use("/api", reviewRouter);
app.use("/api", missionRouter);
app.use("/api", userMissionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));