import { StatusCodes } from 'http-status-codes';
import { bodyToUser } from '../dtos/user.dto.js';
import { userSignUp } from '../services/user.service.js';
import { ValidationError } from '../errors.js';
import { prisma } from '../db.config.js';

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: 사용자 회원가입
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
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               birth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               detailAddress:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               preferences:
 *                 type: array
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