import { StatusCodes } from "http-status-codes";
import {
  addReviewToStore,
  listMyReviews,
  listReviewsByUserId,
} from "../services/review.service.js";
import { toPlainReview } from "../dtos/review.dto.js";

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
    #swagger.responses[400] = {
      description: "요청 값이 유효하지 않은 경우 (score 범위, body 필수 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "V001" },
                  reason: {
                    type: "string",
                    example: "score는 1~5 사이의 숫자여야 합니다."
                  },
                  data: {
                    type: "object",
                    example: { score: 10 }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "가게 또는 유저가 없는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            oneOf: [
              {
                properties: {
                  resultType: { type: "string", example: "FAIL" },
                  error: {
                    type: "object",
                    properties: {
                      errorCode: { type: "string", example: "S001" },
                      reason: {
                        type: "string",
                        example: "가게를 찾을 수 없습니다."
                      },
                      data: {
                        type: "object",
                        example: { storeId: 999 }
                      }
                    }
                  },
                  success: { type: "object", nullable: true, example: null }
                }
              },
              {
                properties: {
                  resultType: { type: "string", example: "FAIL" },
                  error: {
                    type: "object",
                    properties: {
                      errorCode: { type: "string", example: "U002" },
                      reason: {
                        type: "string",
                        example: "사용자를 찾을 수 없습니다."
                      },
                      data: {
                        type: "object",
                        example: {}
                      }
                    }
                  },
                  success: { type: "object", nullable: true, example: null }
                }
              }
            ]
          }
        }
      }
    }
  */
  try {
    const review = await addReviewToStore(req.body, Number(req.params.storeId));
    res.status(StatusCodes.CREATED).success(toPlainReview(review));
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

    #swagger.parameters['userId'] = {
      in: 'query',
      required: true,
      description: '내 리뷰를 조회할 사용자 ID (임시: 인증 미구현으로 query 사용)',
      schema: { type: 'number' },
      example: 1
    }
      
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

    #swagger.responses[404] = {
      description: "유저가 존재하지 않는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: {
                    type: "string",
                    example: "사용자가 없습니다. 먼저 회원가입을 진행하세요."
                  },
                  data: {
                    type: "object",
                    example: {}
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const rawUserId = req.query.userId;
    const userIdFromAuth =
      typeof rawUserId === "string" ? Number(rawUserId) : NaN;

    if (!Number.isFinite(userIdFromAuth)) {
      throw new ValidationError("userId는 숫자여야 합니다.", {
        userId: rawUserId,
      });
    }

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
    #swagger.responses[400] = {
      description: "userId가 숫자가 아닌 경우 (ValidationError)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "V001" },
                  reason: {
                    type: "string",
                    example: "userId는 숫자여야 합니다."
                  },
                  data: {
                    type: "object",
                    example: { userId: "abc" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
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
