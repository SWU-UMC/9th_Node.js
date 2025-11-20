// src/controllers/review.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview, listStoreReviews, listUserReviews } from "../services/review.service.js";

// 리뷰 등록 요청
export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.tags = ['Reviews']
    #swagger.summary = '리뷰 등록'
    #swagger.description = '특정 가게(store_id)와 유저 미션(userMissionId)으로 리뷰를 등록합니다.'

    #swagger.parameters['store_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '리뷰를 등록할 가게의 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $userMissionId: 10,
            $body: "정말 맛있어요!! 또 올게요.",
            $score: 5,
            imageCount: 1
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: '리뷰 등록 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            id: 1,
            userMissionId: 10,
            body: "정말 맛있어요!! 또 올게요.",
            score: 5,
            imageCount: 1,
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-15T12:00:00.000Z"
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청 (필수 필드 누락, score 범위 오류 등)',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[404] = {
      description: '가게(store_id) 또는 유저 미션(userMissionId)을 찾을 수 없는 경우',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[409] = {
      description: '이미 해당 미션에 대한 리뷰가 존재하는 경우 (중복 리뷰)',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  const storeId = Number(req.params.store_id);

  console.log("리뷰 등록 요청:", req.body);

  try {
    const reviewData = bodyToReview(req.body, storeId);
    const review = await addReview(reviewData);

    res.status(StatusCodes.CREATED).success(review);
  } catch (error) {
    next(error);
  }
};

// 특정 가게의 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Reviews']
    #swagger.summary = '특정 가게의 리뷰 목록 조회'
    #swagger.description = '가게(store_id)에 작성된 리뷰 목록을 페이징(cursor 기반)으로 조회합니다.'

    #swagger.parameters['store_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '리뷰를 조회할 가게의 ID'
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: '마지막으로 조회한 리뷰 ID (cursor 기반 페이징)'
    }

    #swagger.responses[200] = {
      description: '리뷰 목록 조회 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            data: [
              {
                id: 1,
                nickname: "워니",
                profileImage: "https://example.com/profile.png",
                score: 5,
                body: "정말 맛있어요!",
                createdAt: "2025-01-15T12:00:00.000Z"
              },
              {
                id: 2,
                nickname: "길동",
                profileImage: null,
                score: 4,
                body: "괜찮았어요.",
                createdAt: "2025-01-16T09:30:00.000Z"
              }
            ],
            pagination: {
              cursor: 2
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: '해당 store_id에 대한 가게가 존재하지 않는 경우',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  try {
    const storeId = parseInt(req.params.store_id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;

    const result = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 내가 작성한 리뷰 목록 조회
export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Reviews']
    #swagger.summary = '내가 작성한 리뷰 목록 조회'
    #swagger.description = '특정 사용자(user_id)가 작성한 리뷰 목록을 페이징(cursor 기반)으로 조회합니다.'

    #swagger.parameters['user_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '리뷰를 조회할 사용자 ID'
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: '마지막으로 조회한 리뷰 ID (cursor 기반 페이징)'
    }

    #swagger.responses[200] = {
      description: '내 리뷰 목록 조회 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            data: [
              {
                id: 1,
                storeName: "홍대 떡볶이",
                body: "여기 떡볶이 최고",
                score: 5,
                imageCount: 2,
                createdAt: "2025-01-15T12:00:00.000Z"
              },
              {
                id: 2,
                storeName: "강남 김밥천국",
                body: "간단하게 먹기 좋음",
                score: 4,
                imageCount: 0,
                createdAt: "2025-01-16T09:30:00.000Z"
              }
            ],
            pagination: {
              cursor: 2
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  const userId =
    typeof req.params.user_id === "string"
      ? parseInt(req.params.user_id)
      : NaN;
  const cursor =
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : null;

  try {
    const result = await listUserReviews(userId, cursor);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};
