import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.route.js";
import storesRouter from "./routes/stores.route.js";
import missionsRouter from "./routes/missions.route.js";
import { prisma } from "./db.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
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

// passport 초기화
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * Swagger 설정
 */
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  try {
    const options = {
      openapi: "3.0.0",
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = "/dev/null"; // 파일 출력 사용 안 함
    const routes = ["./index.js"];  // 이 파일 기준 경로
    const doc = {
      info: {
        title: "UMC 9th",
        description: "UMC 9th Node.js 테스트 프로젝트입니다.",
      },
      host: `localhost:${port}`,
      schemes: ["http"],
      components: {
        schemas: {
          ErrorInfo: {
            type: "object",
            properties: {
              errorCode: {
                type: "string",
                example: "U001"
              },
              reason: {
                type: "string",
                example: "이미 사용 중인 이메일입니다."
              },
              data: {
                type: "object",
                nullable: true,
                example: { email: "test@example.com" },
              },
            },
            required: ["errorCode"],
          },
          ErrorResponse: {
            type: "object",
            properties: {
              resultType: {
                type: "string",
                enum: ["FAIL"],
                example: "FAIL",
              },
              error: {
                $ref: "#/components/schemas/ErrorInfo",
              },
              success: {
                nullable: true,
                example: null,
              },
            },
            required: ["resultType", "error"],
          },
          // 성공 응답 기본 형태
          SuccessResponse: {
            type: "object",
            properties: {
              resultType: {
                type: "string",
                enum: ["SUCCESS"],
                example: "SUCCESS",
              },
              error: {
                nullable: true,
                example: null,
              },
              success: {
                type: "object",
                description:
                "각 API에서 예시 override"
              },
            },
            required: ["resultType", "success"],
          }
        }
      }
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  } catch (err) {
    next(err);
  }
});


/**
 * 라우터 설정
 */
// OAuth / 인증 라우터
app.use("/", authRouter);

// 도메인 라우터
app.use("/api/v1", usersRouter);
app.use("/api/v1", storesRouter);
app.use("/api/v1", missionsRouter);


// JWT 로그인 확인 미들웨어
const isLogin = passport.authenticate('jwt', { session: false });

// 마이페이지 라우트
app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});


/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;

  return res.status(status).json({
    resultType: "FAIL",
    error: {
      errorCode: err.errorCode || "unknown",
      reason: err.reason || err.message || null,
      data: err.data || null,
    },
    success: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});