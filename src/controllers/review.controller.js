import { StatusCodes } from "http-status-codes";
import {
  addReviewToStore,
  listMyReviews,
  listReviewsByUserId,
} from "../services/review.service.js";
import { responseFromReview } from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  /*  
    #swagger.tags = ['Review']
    #swagger.summary = '리뷰 작성 API'
    #swagger.description = ':storeId 가게에 리뷰를 작성'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 작성할 가게 ID',
      schema: { type: 'number' },
      example: 3
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["score", "body"],
            properties: {
              score: { type: "number", example: 5, description: "1~5 사이 점수" },
              body: { type: "string", example: "너무 맛있어요!" }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "리뷰 작성 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "number", example: 12 },
                  score: { type: "number", example: 5 },
                  body: { type: "string", example: "너무 맛있어요!" },
                  userId: { type: "number", example: 1 },
                  storeId: { type: "number", example: 3 },
                  createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                  updatedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const review = await addReviewToStore(req.body, Number(req.params.storeId));
    res.status(StatusCodes.CREATED).success(responseFromReview(review));
  } catch (err) {
    next(err);
  }
};

// 내 리뷰 조회
export const handleListMyReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '내 리뷰 목록 조회 API'
    #swagger.description = '현재 로그인된 사용자의 리뷰 목록을 조회'

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회 커서 (리뷰 id)',
      schema: { type: 'number' },
      example: 0
    }

    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      description: '한 번에 조회할 개수',
      schema: { type: 'number' },
      example: 5
    }

    #swagger.responses[200] = {
      description: "내 리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        body: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 5 },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 3 },
                            name: { type: "string", example: "가게이름" }
                          }
                        },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 10 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const userIdFromAuth = null;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listMyReviews(userIdFromAuth, cursor, take);
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};

// 특정 유저 리뷰 조회
export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Review']
    #swagger.summary = '특정 유저 리뷰 목록 조회 API'
    #swagger.description = ':userId 사용자의 리뷰 목록을 조회'

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '조회할 유저 ID',
      schema: { type: 'number' },
      example: 2
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회 커서',
      schema: { type: 'number' },
      example: 0
    }

    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      description: '한 번에 조회할 개수',
      schema: { type: 'number' },
      example: 5
    }

    #swagger.responses[200] = {
      description: "특정 유저 리뷰 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        body: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 4 },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 3 },
                            name: { type: "string", example: "가게이름" }
                          }
                        },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", example: 10 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const { userId } = req.params;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listReviewsByUserId(userId, cursor, take);
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};
