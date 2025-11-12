import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { handleUserSignUp } from "./src/controllers/user.controller.js";
import { handleAddStore } from "./src/controllers/store.controller.js";
import { handleAddReview,
        handleListUserReviews,
        handleListStoreReviews, } from "./src/controllers/review.controller.js";
import { handleAddMission,
        handleListMissionsByStore, } from "./src/controllers/mission.controller.js";
import { handleChallengeMission } from "./src/controllers/userMission.controller.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.errored = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

/**
*전역 미들웨어 등록
*/
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev'));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * 라우터 설정
 */
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

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});