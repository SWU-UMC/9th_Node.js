import { StatusCodes } from "http-status-codes";
import {
  addMissionToStore,
  challengeMission,
  listUserMissions,
  markMissionCompleted,
} from "../services/mission.service.js";
import {
  responseFromMission,
  responseFromUserMission,
} from "../dtos/mission.dto.js";
import { serialize } from "../utils/serialize.js";

// POST /stores/:storeId/missions
export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Mission']
    #swagger.summary = '가게에 미션 추가 API'
    #swagger.description = ':storeId에 해당하는 가게에 새로운 미션을 추가'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 추가할 가게 ID',
      schema: { type: 'number' },
      example: 3
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["reward", "missionSpec"],
            properties: {
              reward: { type: "number", example: 500, description: "미션 보상 포인트" },
              deadline: {
                type: "string",
                example: "2025-01-01 23:59:59",
                description: "마감 기한 (YYYY-MM-DD 또는 YYYY-MM-DD HH:MM:SS)"
              },
              missionSpec: {
                type: "string",
                example: "가게 방문 후 리뷰 남기기",
                description: "미션 내용 설명"
              }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 생성 성공",
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
                  id: { type: "number", example: 10 },
                  storeId: { type: "number", example: 3 },
                  reward: { type: "number", example: 500 },
                  deadline: { type: "string", example: "2025-01-01 23:59:59" },
                  missionSpec: { type: "string", example: "가게 방문 후 리뷰 남기기" },
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
    const mission = await addMissionToStore(
      req.body,
      Number(req.params.storeId)
    );
    res.status(StatusCodes.CREATED).success(responseFromMission(mission));
  } catch (err) {
    next(err);
  }
};

// POST /missions/:missionId/challenge
export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Mission']
    #swagger.summary = '미션 도전 API'
    #swagger.description = ':missionId 미션에 현재 사용자가 도전'

    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '도전할 미션 ID',
      schema: { type: 'number' },
      example: 5
    }

    #swagger.responses[201] = {
      description: "미션 도전 성공",
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
                  userId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 5 },
                  status: { type: "string", example: "IN_PROGRESS" },
                  startedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                  completedAt: { type: "string", nullable: true, example: null },
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
    const um = await challengeMission(Number(req.params.missionId));
    res.status(StatusCodes.CREATED).success(responseFromUserMission(um));
  } catch (err) {
    next(err);
  }
};

// 진행 중인 미션 목록 조회
export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.tags = ['Mission']
    #swagger.summary = '유저 진행 중 미션 목록 조회 API'
    #swagger.description = ':userId 사용자가 진행 중(IN_PROGRESS)인 미션 목록을 조회'

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '유저 ID',
      schema: { type: 'number' },
      example: 1
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회를 위한 커서 (user_mission.missionId)',
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
      description: "진행 중인 미션 목록 조회 성공",
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
                        userId: { type: "number", example: 1 },
                        missionId: { type: "number", example: 5 },
                        status: { type: "string", example: "IN_PROGRESS" },
                        startedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                        completedAt: { type: "string", nullable: true, example: null },
                        createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                        updatedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                        mission: {
                          type: "object",
                          nullable: true,
                          properties: {
                            id: { type: "number", example: 5 },
                            storeId: { type: "number", example: 3 },
                            reward: { type: "number", example: 500 },
                            missionSpec: { type: "string", example: "가게 방문 후 리뷰 남기기" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 5 }
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
    const userId = Number(req.params.userId);
    const cursor =
      typeof req.query.cursor === "string" ? Number(req.query.cursor) : 0;
    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 5;

    const rows = await listUserMissions(userId, cursor, take);

    const last = rows[rows.length - 1];
    const nextCursor = last ? Number(last.missionId ?? 0) : null;

    res.status(StatusCodes.OK).success({
      data: serialize(rows),
      pagination: { cursor: nextCursor },
    });
  } catch (err) {
    next(err);
  }
};

export const handleCompleteUserMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Mission']
    #swagger.summary = '미션 완료 처리 API'
    #swagger.description = ':userId 사용자의 :missionId 미션을 완료 상태로 변경'

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '유저 ID',
      schema: { type: 'number' },
      example: 1
    }

    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '완료 처리할 미션 ID',
      schema: { type: 'number' },
      example: 5
    }

    #swagger.responses[200] = {
      description: "미션 완료 처리 성공",
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
                  userId: { type: "number", example: 1 },
                  missionId: { type: "number", example: 5 },
                  status: { type: "string", example: "COMPLETED" },
                  startedAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                  completedAt: { type: "string", example: "2025-01-02T00:00:00.000Z" },
                  createdAt: { type: "string", example: "2025-01-01T00:00:00.000Z" },
                  updatedAt: { type: "string", example: "2025-01-02T00:00:00.000Z" }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const userId = Number(req.params.userId);
    const missionId = Number(req.params.missionId);

    const row = await markMissionCompleted(userId, missionId);

    res.status(StatusCodes.OK).success(serialize(row));
  } catch (err) {
    next(err);
  }
};
