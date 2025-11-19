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
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan("dev")); // 로그 포맷: dev
app.use(cookieParser());
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 응답 헬퍼 미들웨어
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
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

// 테스트 라우터
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.send("Hello!");
});

// 쿠키 만드는 라우터
app.get("/setcookie", (req, res) => {
  // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
  res.cookie("myCookie", "hello", { maxAge: 60000 }); // 60초간 유효
  res.send("쿠키가 생성되었습니다!");
});

// 쿠키 읽는 라우터
app.get("/getcookie", (req, res) => {
  // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    console.log(req.cookies); // { myCookie: 'hello' }
    res.send(`당신의 쿠키: ${myCookie}`);
  } else {
    res.send("쿠키가 없습니다.");
  }
});

// 회원가입
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

// 에러 핸들러
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("INTERNAL ERROR:", err);

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
