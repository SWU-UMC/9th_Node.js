import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { handleUserSignUp } from "./src/controllers/user.controller.js";
import { handleAddStore } from "./src/controllers/store.controller.js";
import { handleAddReview,
        handleListUserReviews,
        handleListStoreReviews, }
        from "./src/controllers/review.controller.js";
import { handleAddMission,
        handleListMissionsByStore, }
        from "./src/controllers/mission.controller.js";
import { handleChallengeMission } from "./src/controllers/userMission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// 사용자
app.post("/api/v1/users/signup", handleUserSignUp);
app.get("/api/v1/users/:user_id/reviews", handleListUserReviews);
app.get("/api/v1/users/:user_id/missions", handleListActiveMissions);

// 지역 및 가게
app.post("/api/v1/regions/:region_id/stores", handleAddStore);
app.get("/api/v1/stores/:store_id/missions", handleListMissionsByStore);

// 리뷰
app.post("/api/v1/stores/:store_id/reviews", handleAddReview);
app.get("/api/v1/stores/:store_id/reviews", handleListStoreReviews);

// 미션
app.post("/api/v1/stores/:store_id/missions", handleAddMission);
app.post("/api/v1/missions/:mission_id/challenges", handleChallengeMission);
app.patch(
  "/api/v1/user-missions/:userMissionId/complete",
  handleCompleteMission
);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});