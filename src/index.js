import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleUserSignUp } from "./controllers/user.controller.js";


// 새로 구현한 Controller 함수들 직접 임포트
import { handleAddStore } from './controllers/store.controller.js'; 
import { handleAddReview } from './controllers/review.controller.js';
import { handleAddMission } from './controllers/mission.controller.js';
import { handleChallengeMission } from './controllers/userChallenge.controller.js';

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT;

// 미들웨어 설정
app.use(cors());                            // CORS 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // JSON 형태의 요청 본문 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 본문 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/api/v1/users/signup", handleUserSignUp);

// 새로 구현한 API 라우트 직접 연결

// 1-1. 특정 지역에 가게 추가 API
app.post('/api/v1/stores', handleAddStore); 

// 1-2. 가게에 리뷰 추가 API
app.post('/api/v1/stores/:storeId/reviews', handleAddReview);

// 1-3. 가게에 미션 추가 API
app.post('/api/v1/stores/:storeId/missions', handleAddMission);

// 1-4. 미션 도전하기 API
// Note: handleChallengeMission 내에서 userId를 1로 가정하고 처리해야 합니다.
app.post('/api/v1/users/:userId/challenges', handleChallengeMission);


// API 라우트
//app.post('/api/v1/users/signup', signup);
//app.post('/api/v1/users/login', login);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});