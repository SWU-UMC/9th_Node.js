import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

// ES 모듈에서 현재 디렉토리 이름 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 루트 디렉토리에서 .env 파일 로드
const envPath = path.resolve(__dirname, '../../.env');
try {
  dotenv.config({ path: envPath });
  console.log('Environment variables loaded from:', envPath);
} catch (error) {
  console.warn('Warning: Could not load .env file. Using default environment variables.');
}

import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// 미들웨어 임포트
import { authenticateJWT, requireAdmin } from './auth.config.js';

// 컨트롤러 임포트
import { signUp, updateMyProfile } from './controllers/user.controller.js';
import { 
  handleAddStore, 
  handleListStoreReviews, 
  handleCreateStoreReview,
  getStoreById,
  getStoreMissions
} from './controllers/store.controller.js';

// 미션 컨트롤러 임포트
import {
  getUserMissions,
  completeUserMission,
  assignMissionToUser,
  getUserReviews,
  handleAddMission,
  handleChallengeMission
} from './controllers/mission.controller.js';

// Passport 설정
passport.use(googleStrategy);
passport.use(jwtStrategy);

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

// 1. 미들웨어 설정
// 로깅 미들웨어 (개발 환경에서만 상세 로그 출력)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 기본 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // 원래 true였음
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://127.0.0.1:5500'
  ],
  credentials: true
}));
app.use(express.static('public')); // 정적 파일 제공
app.use(passport.initialize());

// 성공/에러 응답 메서드 추가
app.use((req, res, next) => {
  // 성공 응답 메서드
  res.success = (data, message = '요청이 성공적으로 처리되었습니다.', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  // 에러 응답 메서드
  res.error = (error) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || '서버 오류가 발생했습니다.',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack,
          name: error.name
        })
      },
      timestamp: new Date().toISOString()
    });
  };
  
  next();
});

// 4. 라우트 설정
// 사용자 관련 라우트
app.post('/api/v1/users/signup', signUp);
app.put('/api/v1/users/me', authenticateJWT, updateMyProfile);

// 가게 관련 라우트
app.get('/api/v1/stores/:storeId', getStoreById);
app.post('/api/v1/stores', authenticateJWT, handleAddStore);

// 가게 리뷰 관련 라우트
app.get('/api/v1/stores/:storeId/reviews', handleListStoreReviews);

// 미션 관련 라우트
app.get('/api/v1/stores/:storeId/missions', getStoreMissions);
app.get('/api/v1/users/:userId/missions', authenticateJWT, getUserMissions);
app.patch('/api/v1/users/:userId/missions/:missionId/complete', authenticateJWT, completeUserMission);
app.post('/api/v1/users/:userId/missions', authenticateJWT, assignMissionToUser);

// 리뷰 관련 라우트
app.get('/api/v1/users/:userId/reviews', authenticateJWT, getUserReviews);
app.post('/api/v1/reviews', authenticateJWT, handleCreateStoreReview);
app.post('/api/v1/stores/:storeId/reviews', authenticateJWT, handleCreateStoreReview);

// 미션 도전 관련 라우트
app.post('/api/v1/missions/:missionId/challenge', authenticateJWT, handleChallengeMission);

// 미션 추가 (관리자용)
app.post('/api/v1/missions', authenticateJWT, requireAdmin, handleAddMission);

// API 상태 확인을 위한 엔드포인트
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 쿠키 테스트 엔드포인트
app.get('/api/cookies/set', (req, res) => {
  res.cookie('testCookie', 'hello_world', { 
    maxAge: 60000, // 1분
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({
    success: true,
    message: '쿠키가 설정되었습니다.',
    data: null
  });
});

app.get('/api/cookies/get', (req, res, next) => {
  const testCookie = req.cookies.testCookie;
  
  if (!testCookie) {
    const error = new Error('쿠키를 찾을 수 없습니다.');
    error.statusCode = 404;
    error.name = 'NotFoundError';
    return next(error);
  }
  
  res.status(200).json({
    success: true,
    message: '쿠키를 성공적으로 조회했습니다.',
    data: { testCookie }
  });
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API 라우트
const apiRouter = express.Router();

// 사용자 관련 라우트
apiRouter.post("/users/signup", async (req, res, next) => {
  try {
    await signUp(req, res, next);
  } catch (error) {
    next(error);
  }
});


// Swagger 설정
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UMC 9th API",
      version: "1.0.0",
      description: "UMC 9th Node.js 테스트 프로젝트 API 문서입니다."
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/**/*.js"]
};


/* 9주차실습시작 */
app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);
/* 9주차실습끝 */

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "UMC 9th API 문서"
  })
);

// OpenAPI JSON - Swagger UI에서 숨김
app.get("/openapi.json", (req, res) => {
  // #swagger.ignore = true
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 가게 관련 라우트
apiRouter.get('/stores/:storeId', getStoreById);
apiRouter.post('/stores', handleAddStore);
apiRouter.get('/stores/:storeId/reviews', handleListStoreReviews);
apiRouter.post('/stores/:storeId/reviews', handleCreateStoreReview);

// 미션 관련 라우트
apiRouter.get('/stores/:storeId/missions', getStoreMissions);
apiRouter.post('/stores/:storeId/missions', handleAddMission);
apiRouter.post('/missions/:missionId/challenge', handleChallengeMission);

// API 버저닝
app.use('/api/v1', apiRouter);

// Swagger 문서에서 숨길 라우트
app.get('/openapi.json', (req, res) => {
  // #swagger.ignore = true
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 전역 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // 헤더가 이미 전송된 경우 기본 Express 에러 핸들러에 위임
  if (res.headersSent) {
    return next(err);
  }

  // 기본 에러 응답
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || '서버에서 오류가 발생했습니다.',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        name: err.name,
        ...(err.errors && { details: err.errors })
      })
    },
    timestamp: new Date().toISOString()
  };

  // 특정 에러 유형 처리
  switch (true) {
    // 유효성 검사 에러 (400)
    case err.name === 'ValidationError':
    case statusCode === 400:
      response.error.code = 'VALIDATION_ERROR';
      response.error.details = err.errors || [];
      response.statusCode = 400;
      break;
      
    // Not found errors (404)
    case err.name === 'NotFoundError':
    case statusCode === 404:
      response.error.code = 'NOT_FOUND';
      response.error.message = err.message || '요청하신 리소스를 찾을 수 없습니다.';
      response.statusCode = 404;
      break;
      
    // 인증 에러 (401)
    case err.name === 'UnauthorizedError':
    case statusCode === 401:
      response.error.code = 'UNAUTHORIZED';
      response.error.message = err.message || '인증이 필요합니다.';
      response.statusCode = 401;
      break;
      
    // 접근 거부 에러 (403)
    case err.name === 'ForbiddenError':
    case statusCode === 403:
      response.error.code = 'FORBIDDEN';
      response.error.message = err.message || '접근 권한이 없습니다.';
      response.statusCode = 403;
      break;
      
    // 충돌 에러 (409)
    case err.name === 'ConflictError':
    case statusCode === 409:
      response.error.code = 'CONFLICT';
      response.error.message = err.message || '이미 존재하는 리소스입니다.';
      response.statusCode = 409;
      break;
      
    // 요청 한도 초과 (429)
    case err.name === 'RateLimitError':
      response.error.code = 'RATE_LIMIT_EXCEEDED';
      response.error.message = err.message || '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
      response.statusCode = 429;
      break;
      
    // 처리되지 않은 에러는 기본적으로 500 에러로 처리
    default:
      response.statusCode = 500;
      response.error.code = 'INTERNAL_SERVER_ERROR';
      response.error.message = '서버에서 오류가 발생했습니다.';
      
      // 프로덕션 환경에서는 에러 상세 정보 노출 방지
      if (process.env.NODE_ENV !== 'development') {
        delete response.error.stack;
        delete response.error.name;
      }
  }

  // 에러 응답 전송
  res.status(response.statusCode).json(response);
});


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

// 4. 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청하신 리소스를 찾을 수 없습니다.'
    }
  });
});

// 5. 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  
  // Prisma 에러 처리
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || '필드';
    return res.status(400).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: `${field}이(가) 이미 사용 중입니다.`
      }
    });
  }

  // 커스텀 에러 처리
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'CUSTOM_ERROR',
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // 기타 모든 에러 처리
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버에서 오류가 발생했습니다.',
      ...(process.env.NODE_ENV !== 'production' && { 
        stack: err.stack,
        error: err.message 
      })
    }
  });
});

// 서버 시작
startServer().catch(error => {
  console.error('❌ 서버 시작 중 오류가 발생했습니다:', error);
  process.exit(1);
});





app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);

// JWT 인증 미들웨어
const isLogin = passport.authenticate('jwt', { session: false });

app.get('/', (req, res) => {
    res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});


app.get('/login', (req, res) => {
    res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
});

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    data: {
      user: req.user
    }
  });
});



app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});


app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

//7주차 끝
