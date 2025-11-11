import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  handleCreateStore,
  handleListStoreMissions,
  handleListStoreReviews,
} from "./controllers/store.controller.js";
import {
  handleAddMission,
  handleChallengeMission,
  handleCompleteUserMission,
  handleListUserMissions,
} from "./controllers/mission.controller.js";
import { handleUserSignUp } from "./controllers/user.controller.js";
import {
  handleAddReview,
  handleListMyReviews,
  handleListUserReviews,
} from "./controllers/review.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/user/signup", handleUserSignUp);

// 지역에 가게 추가
app.post("/api/stores", handleCreateStore);

// 가게에 리뷰 추가
app.post("/api/stores/:storeId/reviews", handleAddReview);

// 가게에 미션 추가
app.post("/api/stores/:storeId/missions", handleAddMission);

// 미션 도전하기
app.post("/api/missions/:missionId/challenge", handleChallengeMission);

// 리뷰 목록 조회
app.get("/api/stores/:storeId/reviews", handleListStoreReviews);

// 내 리뷰 목록 조회
app.get("/api/me/reviews", handleListMyReviews);

// 특정 유저 리뷰 목록 조회
app.get("/api/users/:userId/reviews", handleListUserReviews);

// 특정 가게 미션 목록 조회
app.get("/api/stores/:storeId/missions", handleListStoreMissions);

// 내가 진행 중인 미션 목록 조회
app.get("/api/users/:userId/missions", handleListUserMissions);

// 진행 중 미션 완료 처리
app.patch(
  "/api/users/:userId/missions/:missionId/complete",
  handleCompleteUserMission
);

app.use((err, req, res, next) => {
  console.error("INTERNAL ERROR:", err);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
