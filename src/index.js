import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { addMissionController, getMissionsByRestaurantController } from "./controllers/mission.controller.js";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { regionForRestaurant, handleListRestaurantReviews } from "./controllers/restaurant.controller.js";
import { addReviewController } from "./controllers/review.controller.js";
import { startMissionController, handleOngoingMissions } from "./controllers/user_mission.controller.js";

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

app.post("/api/users/signup", handleUserSignUp);
app.post("/api/restaurants", regionForRestaurant);
app.post("/api/restaurants/:restaurant_id/missions", addMissionController);
app.post("/api/restaurants/:mission_id/reviews", addReviewController);
app.post(
  "/api/missions/:mission_id/start",
  startMissionController
);

app.get("/api/restaurants/:restaurant_id/reviews", handleListRestaurantReviews);
app.get("/api/users/:user_id/reviews", handleListRestaurantReviews);
app.get("/api/restaurants/:restaurant_id/missions", getMissionsByRestaurantController);
app.get("/api/users/:user_id/ongoing-missions", handleOngoingMissions);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});