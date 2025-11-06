import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleUserSignUp } from "./controllers/user.controller.js";
import { prisma } from './db.config.js';

// 컨트롤러 임포트
import { 
  handleAddStore, 
  handleListStoreReviews, 
  handleCreateStoreReview,
  getStoreById
} from './controllers/store.controller.js'; 

import { handleAddReview } from './controllers/review.controller.js';
import { handleAddMission } from './controllers/mission.controller.js';
import { handleChallengeMission } from './controllers/userChallenge.controller.js';
import { 
  getStoreMissions, 
  getUserMissions, 
  completeUserMission, 
  assignMissionToUser,
  getUserReviews
} from './controllers/mission.prisma.controller.js';

// .env 파일 로드
dotenv.config();

// Prisma 클라이언트 연결 확인
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma client connected to the database');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    return false;
  }
}

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());                            // CORS 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // JSON 형태의 요청 본문 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 본문 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 사용자 관련 라우트
app.post("/api/v1/users/signup", handleUserSignUp);

// 가게 관련 라우트
app.get('/api/v1/stores/:storeId', getStoreById);
app.post('/api/v1/stores', handleAddStore);
app.get('/api/v1/stores/:storeId/reviews', handleListStoreReviews);
app.post('/api/v1/stores/:storeId/reviews', handleCreateStoreReview);

// 미션 관련 라우트
app.get('/api/v1/stores/:storeId/missions', getStoreMissions);
app.get('/api/v1/users/:userId/missions', getUserMissions);
app.patch('/api/v1/users/:userId/missions/:missionId/complete', completeUserMission);
app.post('/api/v1/users/:userId/missions', assignMissionToUser);
app.get('/api/v1/users/:userId/reviews', getUserReviews);

// 리뷰 관련 라우트
app.post('/api/v1/reviews', handleAddReview);

// 미션 도전 관련 라우트
app.post('/api/v1/missions/:missionId/challenge', handleChallengeMission);

// 미션 추가 (관리자용)
app.post('/api/v1/missions', handleAddMission);

// 서버 시작
async function startServer() {
  // 데이터베이스 연결 확인
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.error('❌ 서버를 시작할 수 없습니다: 데이터베이스 연결 실패');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`✅ 서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

// 서버 시작
startServer().catch(error => {
  console.error('❌ 서버 시작 중 오류가 발생했습니다:', error);
  process.exit(1);
});





app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);