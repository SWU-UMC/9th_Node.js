import { StatusCodes } from "http-status-codes";
import { missionAdd  } from "../services/mission.service.js";

export const addMissionController = async (req, res, next) => {
  /*
  #swagger.summary = '레스토랑 미션 생성 API'
  #swagger.parameters['restaurant_id'] = {
    in: 'path',
    description: '미션을 추가할 레스토랑 ID',
    required: true,
    type: 'number',
    example: 5
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["title", "description", "reward"],
          properties: {
            title: { type: "string", example: "스시 3접시 먹기" },
            description: { type: "string", example: "스시 하루에서 3접시 먹으면 1000포인트 적립" },
            reward: { type: "number", example: 1000, description: "미션 보상 포인트" },
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "미션 생성 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "생성된 미션 정보",
              properties: {
                mission_id: { type: "number", example: 20 },
                restaurant_id: { type: "number", example: 5 },
                title: { type: "string", example: "스시 3접시 먹기" },
                description: { type: "string", example: "스시 하루에서 3접시 먹으면 1000포인트 적립" },
                reward: { type: "number", example: 1000 },
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[400] = {
    description: "잘못된 요청 데이터"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INVALID_INPUT" },
                reason: { type: "string", example: "요청 본문이 유효하지 않습니다." } 
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[401] = {
    description: "인증 실패"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "UNAUTHORIZED" },
                reason: { type: "string", example: "접근 권한이 없거나 토큰이 유효하지 않습니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "리소스를 찾을 수 없음"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "NOT_FOUND" },
                reason: { type: "string", example: "레스토랑 ID를 찾을 수 없습니다. " }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[500] = {
    description: "서버 내부 오류"
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "INTERNAL_SERVER_ERROR" },
                reason: { type: "string", example: "레스토랑 미션 생성 중에 예기치 않은 오류가 발생했습니다. " }
                }
              },
              success: { type: "object", nullable: true, example: null }
              }
            }
          }
        }
      }
    }
  }
*/
    try {
        const { restaurant_id } = req.params;
        const mission = await missionAdd({
          restaurant_id: Number(restaurant_id),
          ...req.body});

        res.status(StatusCodes.OK).success(mission);
  } catch (error) {
    next(error);
  }
};