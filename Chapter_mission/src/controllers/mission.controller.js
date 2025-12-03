// src/controllers/mission.controller.js
import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, listMissionsByStore } from "../services/mission.service.js";

// 미션 등록
export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Missions']
    #swagger.summary = '미션 등록'
    #swagger.description = '특정 가게(store_id)에 사용자가 수행할 수 있는 미션을 등록합니다.'

    #swagger.parameters['store_id'] = {
      in: 'path',
      required: true,
      schema: {
        type: 'integer'
      },
      description: '미션을 등록할 가게의 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { 
                type: "string",
                description: "미션 제목(필수)"
              },
              description: { 
                type: "string",
                description: "미션 설명(선택)"
              },
              point: { 
                type: "integer",
                description: "미션 완료 시 지급할 포인트(0 이상 정수)"
              },
              deadline: { 
                type: "string", 
                format: "date-time",
                description: "마감 기한(선택, ISO 8601 형식)"
              }
            },
            required: ["title", "point"],
            example: {
              title: "인증샷과 함께 리뷰 남기기",
              description: "가게에서 음식 사진과 함께 리뷰를 작성하면 포인트 지급",
              point: 100,
              deadline: "2025-12-31T23:59:59.000Z"
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: '미션 등록 성공',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/SuccessResponse'
          },
          example: {
            resultType: "SUCCESS",
            error: null,
            success: {
              id: 7,
              title: "인증샷과 함께 리뷰 남기기",
              description: "가게에서 음식 사진과 함께 리뷰를 작성하면 포인트 지급",
              point: 100,
              deadline: "2025-12-31T23:59:59.000Z",
              createdAt: "2025-01-15T12:00:00.000Z",
              updatedAt: "2025-01-15T12:00:00.000Z",
              storeId: 3
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청 (필수 필드 누락 등)',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "요청 형식이 올바르지 않습니다. (예: title 누락, point 타입 오류 등)",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: '해당 store_id에 해당하는 가게가 존재하지 않는 경우',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U006",
              reason: "해당 가게(store_id)를 찾을 수 없습니다.",
              data: { storeId: 3 }
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "서버 내부 오류가 발생했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  const storeId = Number(req.params.store_id);

  console.log("미션 등록 요청:", req.body);

  try {
    const missionData = bodyToMission(req.body, storeId);
    const mission = await createMission(missionData);

    res.status(StatusCodes.CREATED).success(mission);
  } catch (error) {
    next(error);
  }
};

// 특정 가게의 미션 목록 조회
export const handleListMissionsByStore = async (req, res, next) => {
  /*
    #swagger.tags = ['Missions']
    #swagger.summary = '특정 가게의 미션 목록 조회'
    #swagger.description = '가게(store_id)에 등록된 모든 미션 목록을 조회합니다.'

    #swagger.parameters['store_id'] = {
      in: 'path',
      required: true,
      schema: {
        type: 'integer'
      },
      description: '미션을 조회할 가게의 ID'
    }

    #swagger.responses[200] = {
      description: '미션 목록 조회 성공',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/SuccessResponse'
          },
          example: {
            resultType: "SUCCESS",
            error: null,
            success: [
              {
                id: 7,
                title: "인증샷과 함께 리뷰 남기기",
                description: "가게에서 음식 사진과 함께 리뷰를 작성하면 포인트 지급",
                point: 100,
                deadline: "2025-12-31T23:59:59.000Z",
                createdAt: "2025-01-15T12:00:00.000Z",
                updatedAt: "2025-01-15T12:00:00.000Z"
              },
              {
                id: 8,
                title: "친구와 함께 방문하기",
                description: "2인 이상 방문 인증 시 포인트 지급",
                point: 150,
                deadline: null,
                createdAt: "2025-01-16T12:00:00.000Z",
                updatedAt: "2025-01-16T12:00:00.000Z"
              }
            ]
          }
        } 
      }
    }

    #swagger.responses[404] = {
      description: '해당 store_id에 대한 미션이 없거나 가게가 존재하지 않는 경우',
      content: {
        "application/json": {
          schema: {
            $ref: '#/components/schemas/ErrorResponse'
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "해당 store_id에 대한 미션이 없거나 가게가 존재하지 않습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ErrorResponse"
          },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "unknown",
              reason: "서버 내부 오류가 발생했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */

  try {
    const storeId = Number(req.params.store_id);

    const missions = await listMissionsByStore(storeId);

    res.status(StatusCodes.OK).success(missions);
  } catch (error) {
    next(error);
  }
};
