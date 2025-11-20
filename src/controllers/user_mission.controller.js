import { StatusCodes } from "http-status-codes";
import { startMission, getOngoingMissionsService } from "../services/user_mission.service.js";

export const startMissionController = async (req, res, next) => {
  /*
  #swagger.summary = '미션 시작 API'
  #swagger.parameters['mission_id'] = {
    in: 'path',
    description: '시작할 미션 ID',
    required: true,
    type: 'number',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["user_id"],
          properties: {
            user_id: { 
              type: "number", 
              example: 1, 
              description: "미션을 시작하는 사용자 ID" 
            }
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "미션 시작 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              description: "사용자가 시작한 미션 정보",
              properties: {
                user_mission_id: { type: "number", example: 1 },
                user_id: { type: "number", example: 5 },
                mission_id: { type: "number", example: 101 },
                status: { type: "string", example: "ONGOING", description: "미션 상태" },
                started_at: { type: "string", example: "2025-01-22T12:33:11.000Z" }
              }
            }
          }
        }
      }
    }
  }
*/

  try {
    const { mission_id } = req.params; // URL에서 missionId 획득
    const { user_id } = req.body;

    const missionIdAsNumber = Number(mission_id);

    const userMission = await startMission(user_id, missionIdAsNumber);

    res.status(StatusCodes.OK).success(userMission);
  } catch (error) {
    next(error); // 에러 핸들러로 넘김
  }
};

//진행 중인 미션 조회
export const handleOngoingMissions = async (req, res, next) => {
  /*
  #swagger.summary = '진행 중인 미션 목록 조회 API'

  #swagger.parameters['user_id'] = {
    in: 'path',
    description: '사용자 ID',
    required: true,
    type: 'number',
    example: 5
  }

  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '페이지네이션을 위한 커서 값',
    required: false,
    type: 'number',
    example: 10
  }

  #swagger.parameters['limit'] = {
    in: 'query',
    description: '가져올 항목 개수 (기본값 5)',
    required: false,
    type: 'number',
    example: 5
  }

  #swagger.responses[200] = {
    description: "진행 중인 미션 목록 조회 성공 응답",
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
                missions: {
                  type: "array",
                  description: "진행 중인 미션 목록",
                  items: {
                    type: "object",
                    properties: {
                      mission_id: { type: "number", example: 101 },
                      title: { type: "string", example: "오늘의 파스타 주문" },
                      description: { type: "string", example: "메뉴 주문 후 인증샷 업로드" },
                      reward: { type: "number", example: 300 },
                      restaurant: {
                        type: "object",
                        properties: {
                          restaurant_id: { type: "number", example: 12 },
                          restaurant_name: { type: "string", example: "김밥천국 홍대점" }
                        }
                      },
                      status: { type: "string", example: "ONGOING" },
                    }
                  }
                },
                pagination: {
                  type: "object",
                  properties: {
                    cursor: { 
                      type: "number", 
                      nullable: true, 
                      example: 20,
                      description: "다음 페이지 조회를 위한 커서 값"
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
    const { user_id } = req.params;
    const { cursor, limit } = req.query;

    const userIdAsNumber = Number(user_id);

    const result = await getOngoingMissionsService(
      userIdAsNumber,
      typeof cursor === "string" ? parseInt(cursor) : 0,
      Number(limit) || 5
    );

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};