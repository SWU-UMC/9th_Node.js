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
 * @swagger
 * /api/v1/stores/{storeId}/missions:
 *   post:
 *     summary: Add a new mission to a store
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
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
 *               reward:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Mission added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
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
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: '미션이 성공적으로 추가되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions:
 *   get:
 *     summary: Get user's missions
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user's missions
 *       500:
 *         description: Internal server error
 */
export const getUserMissions = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const missions = await missionService.getUserMissions(userId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            data: missions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions/{missionId}/complete:
 *   patch:
 *     summary: Complete a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mission completed successfully
 *       404:
 *         description: Mission not found or already completed
 *       500:
 *         description: Internal server error
 */
export const completeUserMission = async (req, res, next) => {
    try {
        const { userId, missionId } = req.params;
        const result = await missionService.completeMission(parseInt(userId), parseInt(missionId));
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: '미션이 성공적으로 완료되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/missions:
 *   post:
 *     summary: Assign a mission to a user
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       201:
 *         description: Mission assigned successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Internal server error
 */
export const assignMissionToUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const { missionId } = req.body;

        if (!missionId) {
            throw new ValidationError('미션 ID는 필수 항목입니다.');
        }

        const result = await missionService.assignMissionToUser(userId, missionId);
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: '미션이 성공적으로 할당되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/users/{userId}/reviews:
 *   get:
 *     summary: Get user's reviews
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user's reviews
 *       500:
 *         description: Internal server error
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const reviews = await missionService.getUserReviews(userId);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: reviews
    });
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
export const getStoreMissions = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        const missions = await missionService.getMissionsByStoreId(storeId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            data: missions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/missions/{missionId}/challenge:
 *   post:
 *     summary: Challenge a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       201:
 *         description: Mission challenged successfully
 *       400:
 *         description: Already challenging this mission
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Internal server error
 */
export const handleChallengeMission = async (req, res, next) => {
    try {
        const missionId = parseInt(req.params.missionId);
        const { userId } = req.body;

        if (!userId) {
            throw new ValidationError('사용자 ID는 필수 항목입니다.');
        }

        const result = await missionService.challengeMission(missionId, userId);
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: '미션 도전이 시작되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};
