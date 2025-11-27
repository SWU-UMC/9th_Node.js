import * as missionService from '../services/mission.service.js';
import { StatusCodes } from 'http-status-codes';

// Error handling with standard Error and status codes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = '유효성 검사에 실패했습니다.', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

/**
/**
 * @swagger
 * /api/v1/stores/{storeId}/missions:
 *   post:
 *     summary: 가게에 새로운 미션 추가
 *     description: 관리자가 특정 가게에 새로운 미션을 추가합니다
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 미션을 추가할 가게의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 미션 내용
 *                 example: "이 가게에서 3만원 이상 구매하기"
 *               reward:
 *                 type: integer
 *                 description: 미션 보상 포인트
 *                 example: 1000
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 미션 마감일 (ISO 8601 형식)
 *                 example: "2023-12-31T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: 성공적으로 미션이 추가됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 생성된 미션 ID
 *                 content:
 *                   type: string
 *                 reward:
 *                   type: integer
 *                 storeId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE, INACTIVE]
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "미션 내용은 필수입니다."
 *       401:
 *         description: 인증 실패 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 (관리자만 접근 가능)
 *       404:
 *         description: 가게를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가게를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "미션 추가 중 오류가 발생했습니다."
 */
export const handleAddMission = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        const { content, reward, deadline } = req.body;

        if (!content) {
            throw new ValidationError('미션 내용은 필수 항목입니다.');
        }

        const result = await missionService.addNewMission(storeId, { 
            content, 
            reward, 
            deadline 
        });
        
        res.success(result, '미션이 성공적으로 추가되었습니다.', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions:
 *   get:
 *     summary: 사용자 미션 목록 조회
 *     description: 특정 사용자가 도전 중이거나 완료한 미션 목록을 조회합니다.
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 미션 목록을 조회할 사용자의 고유 ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [IN_PROGRESS, COMPLETED, FAILED]
 *         description: 미션 상태 필터링, 선택사항입니다
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호, 기본값은 1입니다
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 페이지당 항목 수, 기본값 10, 최대 100까지 가능합니다
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 미션 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 미션 도전 기록 ID
 *                       missionId:
 *                         type: integer
 *                         description: 미션 ID
 *                       userId:
 *                         type: integer
 *                         description: 사용자 ID
 *                       status:
 *                         type: string
 *                         enum: [IN_PROGRESS, COMPLETED, FAILED]
 *                         description: 미션 진행 상태
 *                       progress:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 100
 *                         description: 미션 진행률 (%)
 *                       startedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 미션 시작 일시
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 미션 완료 일시 (완료된 경우)
 *                       mission:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           content:
 *                             type: string
 *                           reward:
 *                             type: integer
 *                           deadline:
 *                             type: string
 *                             format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: 전체 항목 수
 *                     totalPages:
 *                       type: integer
 *                       description: 전체 페이지 수
 *                     currentPage:
 *                       type: integer
 *                       description: 현재 페이지 번호
 *                     itemsPerPage:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     message:
 *                       type: string
 *                       example: "잘못된 페이지 번호입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     message:
 *                       type: string
 *                       example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 (본인만 조회 가능)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "USER_NOT_FOUND"
 *                     message:
 *                       type: string
 *                       example: "사용자를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "미션 목록 조회 중 오류가 발생했습니다."
 */
export const getUserMissions = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const missions = await missionService.getUserMissions(userId);
        
        res.success(missions);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions/{missionId}/complete:
 *   patch:
 *     summary: 미션 완료 처리
 *     description: 사용자가 도전 중인 미션을 완료 상태로 변경합니다.
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 미션을 완료할 사용자의 고유 ID
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 완료할 미션의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proofImage:
 *                 type: string
 *                 format: binary
 *                 description: 미션 완료 증빙 이미지 (선택사항)
 *     responses:
 *       200:
 *         description: 성공적으로 미션을 완료 처리했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 미션 도전 기록 ID
 *                     status:
 *                       type: string
 *                       enum: [COMPLETED]
 *                       example: "COMPLETED"
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 미션 완료 일시
 *                     rewardEarned:
 *                       type: integer
 *                       description: 획득한 보상 포인트
 *                 message:
 *                   type: string
 *                   example: "미션을 성공적으로 완료했습니다!"
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     message:
 *                       type: string
 *                       example: "잘못된 요청 파라미터입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     message:
 *                       type: string
 *                       example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 (본인만 완료 처리 가능)
 *       404:
 *         description: 미션 도전 기록을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "MISSION_RECORD_NOT_FOUND"
 *                     message:
 *                       type: string
 *                       example: "미션 도전 기록을 찾을 수 없습니다."
 *       409:
 *         description: 이미 완료되었거나 진행 중이 아닌 미션
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INVALID_MISSION_STATUS"
 *                     message:
 *                       type: string
 *                       example: "이미 완료된 미션이거나 진행 중인 미션이 아닙니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "미션 완료 처리 중 오류가 발생했습니다."
 */
export const completeUserMission = async (req, res, next) => {
    try {
        const { userId, missionId } = req.params;
        const result = await missionService.completeMission(parseInt(userId), parseInt(missionId));
        
        res.success(result, '미션이 성공적으로 완료되었습니다.');
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions:
 *   post:
 *     summary: 사용자에게 미션 할당
 *     description: 관리자가 특정 사용자에게 미션을 할당합니다.
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 미션을 할당할 사용자의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - missionId
 *             properties:
 *               missionId:
 *                 type: integer
 *                 description: 할당할 미션의 고유 ID
 *                 example: 1
 *     responses:
 *       201:
 *         description: 성공적으로 미션이 할당되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 생성된 미션 할당 기록 ID
 *                     missionId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [ASSIGNED, IN_PROGRESS]
 *                       example: "ASSIGNED"
 *                     assignedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 미션 할당 일시
 *                 message:
 *                   type: string
 *                   example: "미션이 성공적으로 할당되었습니다."
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     message:
 *                       type: string
 *                       example: "미션 ID는 필수 항목입니다."
 *       401:
 *         description: 인증 실패 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     message:
 *                       type: string
 *                       example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 (관리자만 접근 가능)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "FORBIDDEN"
 *                     message:
 *                       type: string
 *                       example: "이 작업을 수행할 권한이 없습니다."
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "NOT_FOUND"
 *                     message:
 *                       type: string
 *                       oneOf:
 *                         - example: "사용자를 찾을 수 없습니다."
 *                         - example: "미션을 찾을 수 없습니다."
 *       409:
 *         description: 이미 할당된 미션
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "MISSION_ALREADY_ASSIGNED"
 *                     message:
 *                       type: string
 *                       example: "이미 해당 사용자에게 할당된 미션입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "미션 할당 중 오류가 발생했습니다."
 */
export const assignMissionToUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const { missionId } = req.body;

        if (!missionId) {
            throw new ValidationError('미션 ID는 필수 항목입니다.');
        }

        const result = await missionService.assignMissionToUser(userId, missionId);
        
        res.success(result, '미션이 성공적으로 할당되었습니다.', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/reviews:
 *   get:
 *     summary: 사용자 리뷰 조회
 *     description: 특정 사용자가 작성한 모든 리뷰 목록을 조회합니다.
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 리뷰를 조회할 사용자의 고유 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 페이지당 항목 수 (최대 100)
 *     responses:
 *       200:
 *         description: 성공적으로 리뷰 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 리뷰 ID
 *                       content:
 *                         type: string
 *                         description: 리뷰 내용
 *                       rating:
 *                         type: number
 *                         minimum: 1
 *                         maximum: 5
 *                         description: 평점 (1~5)
 *                       userId:
 *                         type: integer
 *                         description: 리뷰 작성자 ID
 *                       storeId:
 *                         type: integer
 *                         description: 리뷰 대상 가게 ID
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 리뷰 작성 일시
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 리뷰 수정 일시
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: 전체 항목 수
 *                     totalPages:
 *                       type: integer
 *                       description: 전체 페이지 수
 *                     currentPage:
 *                       type: integer
 *                       description: 현재 페이지 번호
 *                     itemsPerPage:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     message:
 *                       type: string
 *                       example: "잘못된 페이지 번호입니다."
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (본인 또는 관리자만 조회 가능)
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "USER_NOT_FOUND"
 *                     message:
 *                       type: string
 *                       example: "사용자를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "리뷰 목록 조회 중 오류가 발생했습니다."
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const reviews = await missionService.getUserReviews(userId);
    
    res.success(reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/stores/{storeId}/missions:
 *   get:
 *     summary: Get all missions for a store
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of store's missions
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/stores/{storeId}/missions:
 *   get:
 *     summary: 가게의 미션 목록 조회
 *     description: 특정 가게에 등록된 모든 미션 목록을 조회합니다.
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 미션 목록을 조회할 가게의 고유 ID
 *     responses:
 *       200:
 *         description: 성공적으로 미션 목록을 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   reward:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, INACTIVE]
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: 잘못된 요청 파라미터
 *       404:
 *         description: 가게를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가게를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "미션 목록 조회 중 오류가 발생했습니다."
 */
export const getStoreMissions = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        const missions = await missionService.getMissionsByStoreId(storeId);
        
        res.success(missions);
    } catch (error) {
        next(error);
    }
};
/**
 * @swagger
 * /api/v1/missions/{missionId}/challenge:
 *   post:
 *     summary: 미션에 도전하기
 *     description: 사용자가 특정 미션에 도전합니다.
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 도전할 미션의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 미션에 도전하는 사용자의 ID
 *                 example: 1
 *     responses:
 *       201:
 *         description: 성공적으로 미션에 도전했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 생성된 미션 도전 기록 ID
 *                     missionId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [IN_PROGRESS, COMPLETED, FAILED]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "미션에 도전했습니다!"
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     message:
 *                       type: string
 *                       example: "사용자 ID는 필수 항목입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     message:
 *                       type: string
 *                       example: "인증이 필요합니다."
 *       404:
 *         description: 미션을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "NOT_FOUND"
 *                     message:
 *                       type: string
 *                       example: "미션을 찾을 수 없습니다."
 *       409:
 *         description: 이미 도전 중이거나 완료한 미션
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "MISSION_ALREADY_TAKEN"
 *                     message:
 *                       type: string
 *                       example: "이미 도전 중인 미션입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "미션 도전 중 오류가 발생했습니다."
 */
export const handleChallengeMission = async (req, res, next) => {
    try {
        const missionId = parseInt(req.params.missionId);
        const { userId } = req.body;

        if (!userId) {
            throw new ValidationError('사용자 ID는 필수 항목입니다.');
        }

        const result = await missionService.challengeMission(missionId, userId);
        
        res.success(result, '미션에 도전했습니다!', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
};
