import { StatusCodes } from 'http-status-codes';
import { bodyToUser } from '../dtos/user.dto.js';
import { userSignUp } from '../services/user.service.js';
import { ValidationError } from '../errors.js';
import { prisma } from '../db.config.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 고유 ID
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: 사용자 이름
 *           example: "홍길동"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           description: 성별
 *           example: "MALE"
 *         birth:
 *           type: string
 *           format: date
 *           description: 생년월일 (YYYY-MM-DD)
 *           example: "1990-01-01"
 *         address:
 *           type: string
 *           description: 기본 주소
 *           example: "서울특별시 강남구 테헤란로 123"
 *         detailAddress:
 *           type: string
 *           description: 상세 주소
 *           example: "101동 101호"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           description: 휴대폰 번호 ('-' 제외)
 *           example: "01012345678"
 *         preferences:
 *           type: array
 *           description: 선호 카테고리 목록
 *           items:
 *             type: string
 *           example: ["한식", "중식"]
 *
 * /api/users/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 새로운 사용자를 시스템에 등록합니다. 이메일, 비밀번호, 이름, 성별, 생년월일, 주소는 필수 입력 항목입니다.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - gender
 *               - birth
 *               - address
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일 (로그인 ID로 사용)
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: 비밀번호 (8자 이상)
 *                 example: "password123!"
 *               name:
 *                 type: string
 *                 description: 사용자 실명
 *                 example: "홍길동"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: 성별
 *                 example: "MALE"
 *               birth:
 *                 type: string
 *                 format: date
 *                 description: 생년월일 (YYYY-MM-DD)
 *                 example: "1990-01-01"
 *               address:
 *                 type: string
 *                 description: 기본 주소
 *                 example: "서울특별시 강남구 테헤란로 123"
 *               detailAddress:
 *                 type: string
 *                 description: 상세 주소
 *                 example: "101동 101호"
 *               phoneNumber:
 *                 type: string
 *                 description: 휴대폰 번호 ('-' 제외)
 *                 example: "01012345678"
 *               preferences:
 *                 type: array
 *                 description: 선호 카테고리 목록 (선택사항)
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 유효성 검사 실패
 *       409:
 *         description: 이메일 중복
 *       500:
 *         description: 서버 오류
 */
/**
 * 사용자 회원가입 컨트롤러
 */
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string" },
              preferences: { type: "array", items: { type: "number" } }
            },
            required: ["email", "name", "gender", "birth", "address", "phoneNumber"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    const user = bodyToUser(req.body);
    const result = await userSignUp(user);
    res.success(result);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  try {
    console.log('\n=== 회원가입 요청 시작 ===');
    console.log('요청 바디:', JSON.stringify(req.body, null, 2));

    // 요청 본문 유효성 검사
    if (!req.body || typeof req.body !== 'object') {
      throw new ValidationError('유효하지 않은 요청 본문입니다.');
    }

    // DTO 변환
    const userData = bodyToUser(req.body);
    console.log('변환된 사용자 데이터:', JSON.stringify(userData, null, 2));

    // 회원가입 서비스 호출
    const user = await userSignUp({
      ...userData,
      birth: userData.birth ? new Date(userData.birth) : null
    });

    console.log('회원가입 성공:', JSON.stringify(user, null, 2));

    // 성공 응답
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: user
    });
  } catch (error) {
    // 에러 로깅
    console.error('\n!!! 회원가입 중 오류 발생 !!!');
    console.error('에러 이름:', error.name);
    console.error('에러 메시지:', error.message);
    
    // Prisma 에러 로깅
    if (error.code) {
      console.error('Prisma 에러 코드:', error.code);
      console.error('Prisma 에러 메타데이터:', JSON.stringify(error.meta, null, 2));
    }
    
    // 에러 객체에 스택 트레이스 추가 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.error('에러 스택:', error.stack);
    }
    
    // 다음 미들웨어로 에러 전달
    next(error);
  }
};