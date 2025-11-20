import { StatusCodes } from "http-status-codes";
import { createStore, listStoreReviews } from "../services/store.service.js";
import { listStoreMissions } from "../services/mission.service.js";
import { serialize } from "../utils/serialize.js";

export const handleCreateStore = async (req, res, next) => {
  /*  
    #swagger.tags = ['Store']
    #swagger.summary = '가게 생성 API'
    #swagger.description = '새로운 가게를 생성합니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["regionId", "name"],
            properties: {
              regionId: { type: "number", example: 1 },
              name: { type: "string", example: "가게이름" },
              address: { type: "string", example: "00시 00구" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "가게 생성 성공",
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
                  id: { type: "number", example: 12 },
                  regionId: { type: "number", example: 1 },
                  name: { type: "string", example: "가게이름" },
                  address: { type: "string", example: "00시 00구" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "유효성 검사 실패 (예: regionId가 없는 경우)",
    }
  */
  try {
    const newStore = await createStore(req.body);
    res.status(StatusCodes.CREATED).success(newStore);
  } catch (err) {
    next(err);
  }
};

// 리뷰
export const handleListStoreReviews = async (req, res, next) => {
  /*  
    #swagger.tags = ['Review']
    #swagger.summary = '가게 리뷰 목록 조회'
    #swagger.description = ':storeId에 해당하는 가게의 리뷰 목록을 조회합니다.'
    
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '가게 ID',
      schema: { type: 'number'},
      example: 1
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회를 위한 커서 (리뷰 id)',
      schema: { type: 'number'},
      example: 0
    }

    #swagger.responses[200] = {
      description: "리뷰 리스트 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                description: "리뷰 목록 + 페이지네이션 정보",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        body: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 5 },
                        createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 3 },
                            name: { type: "string", example: "홍콩반점" }
                          }
                        },
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "UMC" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: {
                        type: "number",
                        nullable: true,
                        example: 10,
                        description: "다음 페이지 조회를 위한 커서 (없으면 null)"
                      }
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
    const storeId = req.params.storeId;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    const last = reviews[reviews.length - 1];
    const nextCursor = last ? Number(last.id ?? 0) : null;

    res.status(StatusCodes.OK).success({
      data: reviews,
      pagination: { cursor: nextCursor },
    });
  } catch (err) {
    next(err);
  }
};

// 미션
export const handleListStoreMissions = async (req, res, next) => {
  /*  
    #swagger.tags = ['Mission']
    #swagger.summary = '가게 미션 목록 조회'
    #swagger.description = ':storeId에 해당하는 가게의 미션 목록을 조회합니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '가게 ID',
      schema: { type: 'number'}, 
      example: 3
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: "다음 페이지 조회를 위한 커서 (mission.id)",
      schema: { type: 'number' }, 
      example: 0,
    }

    #swagger.parameters['take'] = {
      in: 'query',
      required: false,
      schema: { type: 'number'}, 
      example: 5,
      description: "한 번에 가져올 개수"
    }

    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공",
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
                        id: { type: "number", example: 10 },
                        storeId: { type: "number", example: 3 },
                        reward: { type: "number", example: 500 },
                        deadline: {
                          type: "string",
                          example: "2025-01-01 23:59:59"
                        },
                        missionSpec: { type: "string", example: "가게 방문 후 리뷰 남기기" },
                        createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                        updatedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" }
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
    const storeId = req.params.storeId;
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const result = await listStoreMissions(storeId, cursor, take);

    // BigInt와 Date 변환
    const serializedResult = serialize(result);

    res.status(StatusCodes.OK).success(serializedResult);
  } catch (err) {
    next(err);
  }
};
