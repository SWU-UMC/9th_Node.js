import * as storeService from '../services/store.service.js';
import { listStoreReviews, getStoreById as getStoreByIdService } from '../services/store.service.js';
import { StatusCodes } from 'http-status-codes';

/**
 * POST /api/v1/stores 엔드포인트 핸들러
 */
export const handleAddStore = async (req, res) => {
    const { name, address, region } = req.body;

    if (!name || !address || !region) {
        return res.status(400).json({ message: '모든 가게 정보를 입력해야 합니다.' });
    }

    try {
        const result = await storeService.addNewStore({ name, address, region });
        return res.status(201).json(result); // 201 Created
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '가게 추가 중 오류 발생' });
    }
};

export const handleListStoreReviews = async (req, res, next) => {
  try {
    const reviews = await storeService.listStoreReviews(
      req.params.storeId,
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : undefined
    );
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/stores/:storeId
 * 가게 상세 정보 조회
 */
export const getStoreById = async (req, res, next) => {
  try {
    const store = await getStoreByIdService(req.params.storeId);
    if (!store) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '가게를 찾을 수 없습니다.'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error listing store reviews:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '가게 리뷰 조회 중 오류가 발생했습니다.' });
  }
};

/**
 * POST /api/v1/stores/:storeId/reviews
 * 가게 리뷰 생성
 */
export const handleCreateStoreReview = async (req, res, next) => {
  try {
    const { content, rating, userId } = req.body;
    const storeId = parseInt(req.params.storeId);

    // 테스트를 위해 인증 검사 일시 비활성화
    // if (!userId) {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({ 
    //     message: '로그인이 필요합니다.' 
    //   });
    // }

    const review = await storeService.createStoreReview({
      content,
      rating,
      userId,
      storeId
    });

    res.status(StatusCodes.CREATED).json({
      message: '리뷰가 성공적으로 등록되었습니다.',
      data: review
    });
  } catch (error) {
    console.error('Error creating store review:', error);
    
    if (error.message.includes('가게를 찾을 수 없습니다')) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: error.message 
      });
    }
    
    if (error.message.includes('필수') || error.message.includes('평점')) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: error.message 
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: '리뷰 등록 중 오류가 발생했습니다.' 
    });
  }
};