import * as storeService from '../services/store.service.js';
import { listStoreReviews, getStoreById as getStoreByIdService } from '../services/store.service.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors.js';

/**
 * @swagger
 * /api/v1/stores:
 *   post:
 *     summary: 새로운 가게 추가
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - region
 *             properties:
 *               name:
 *                 type: string
 *                 description: 가게 이름
 *               address:
 *                 type: string
 *                 description: 가게 주소
 *               region:
 *                 type: string
 *                 description: 지역 정보
 *     responses:
 *       201:
 *         description: 성공적으로 가게가 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 생성된 가게 ID
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 region:
 *                   type: string
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "모든 가게 정보를 입력해야 합니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가게 추가 중 오류가 발생했습니다."
 */
export const handleAddStore = async (req, res, next) => {
    try {
        const { name, address, region } = req.body;

        if (!name || !address || !region) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: '모든 가게 정보를 입력해야 합니다.' 
            });
        }

        const result = await storeService.addNewStore({ 
            name, 
            address, 
            region 
        });
        
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: '가게가 성공적으로 등록되었습니다.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/v1/stores/{storeId}/reviews:
 *   get:
 *     summary: 가게 리뷰 목록 조회
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰를 조회할 가게의 ID
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: 페이지네이션을 위한 커서 (선택사항)
 *     responses:
 *       200:
 *         description: 성공적으로 리뷰 목록을 가져옴
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                         description: 평점 (1~5)
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 리뷰 작성 일시
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: 작성자 ID
 *                           name:
 *                             type: string
 *                             description: 작성자 이름
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     cursor:
 *                       type: integer
 *                       nullable: true
 *                       description: 다음 페이지 조회를 위한 커서 (없을 경우 null)
 *       400:
 *         description: 잘못된 요청 파라미터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청 파라미터입니다."
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
 *                   example: "리뷰 목록 조회 중 오류가 발생했습니다."
 */
export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
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
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const reviews = await storeService.listStoreReviews(
      req.params.storeId,
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : undefined
    );
    res.success(reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/stores/{storeId}:
 *   get:
 *     summary: 가게 상세 정보 조회
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 가게의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 가게 정보를 가져옴
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 가게 ID
 *                 name:
 *                   type: string
 *                   description: 가게 이름
 *                 address:
 *                   type: string
 *                   description: 가게 주소
 *                 region:
 *                   type: string
 *                   description: 지역 정보
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성 일시
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
 *                   example: "가게 정보 조회 중 오류가 발생했습니다."
 */
export const getStoreById = async (req, res, next) => {
  try {
    const store = await getStoreByIdService(req.params.storeId);
    if (!store) {
      const error = new Error('가게를 찾을 수 없습니다.');
      error.statusCode = StatusCodes.NOT_FOUND;
      throw error;
    }
    
    return res.success(store);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/stores/:storeId/reviews
 * 가게 리뷰 생성
 */
/**
 * GET /api/v1/stores/:storeId/missions
 * 가게의 미션 목록 조회
 */
export const getStoreMissions = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        const missions = await storeService.getStoreMissions(storeId);
        
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
 * /api/v1/stores/{storeId}/reviews:
 *   post:
 *     summary: 가게 리뷰 작성
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰를 작성할 가게의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - rating
 *             properties:
 *               content:
 *                 type: string
 *                 description: 리뷰 내용
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: 평점 (1~5)
 *     responses:
 *       201:
 *         description: 성공적으로 리뷰가 작성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 생성된 리뷰 ID
 *                 content:
 *                   type: string
 *                 rating:
 *                   type: integer
 *                 storeId:
 *                   type: integer
 *                 userId:
 *                   type: integer
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
 *                   example: "리뷰 내용과 평점은 필수입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
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
 *                   example: "리뷰 작성 중 오류가 발생했습니다."
 */
export const handleCreateStoreReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { content, rating } = req.body;
        const storeId = parseInt(req.params.storeId);

        if (!content || !rating) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: '리뷰 내용과 평점은 필수입니다.'
            });
        }

        const review = await storeService.createStoreReview({
            content,
            rating,
            userId,
            storeId
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: '리뷰가 성공적으로 등록되었습니다.',
            data: review
        });
    } catch (error) {
        console.error('Error creating store review:', error);
        
        if (error.message.includes('가게를 찾을 수 없습니다')) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false,
                message: error.message 
            });
        }
        
        if (error.message.includes('필수') || error.message.includes('평점')) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: error.message 
            });
        }
        
        next(error);
    }
};

// handleAddReview는 handleCreateStoreReview의 별칭으로 사용
export const handleAddReview = handleCreateStoreReview;