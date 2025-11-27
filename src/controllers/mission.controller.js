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
    #swagger.tags = ['Store']
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

    #swagger.responses[400] = {
      description: "reward, missionSpec, deadline 형식이 유효하지 않은 경우",
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
                    example: "reward는 양의 숫자여야 합니다."
                  },
                  data: {
                    type: "object",
                    example: { reward: -100 }
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
      description: "가게를 찾을 수 없는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
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
    };

    #swagger.responses[404] = {
      description: "미션 또는 유저가 존재하지 않는 경우",
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
                      errorCode: { type: "string", example: "M001" },
                      reason: {
                        type: "string",
                        example: "미션을 찾을 수 없습니다."
                      },
                      data: { type: "object", example: { missionId: 999 } }
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
                        example: "회원가입을 먼저 해주세요."
                      },
                      data: { type: "object", example: {} }
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

    #swagger.responses[409] = {
      description: "이미 도전 중이거나 완료한 미션인 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "M002"
                  },
                  reason: {
                    type: "string",
                    example: "이미 도전 중인 미션입니다."
                  },
                  data: {
                    type: "object",
                    example: { missionId: 1, userId: 1 }
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
    const userId = req.user.id;
    const um = await challengeMission(userId, Number(req.params.missionId));
    res.status(StatusCodes.CREATED).success(responseFromUserMission(um));
  } catch (err) {
    next(err);
  }
};

// 진행 중인 미션 목록 조회
export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.tags = ['Mission']
    #swagger.summary = '특정 유저 진행 중 미션 목록 조회 API'
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

    #swagger.responses[400] = {
      description: "userId, cursor, take 값이 유효하지 않은 경우",
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
                    example: { userId: "abc", cursor: -1, take: 0 }
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

    #swagger.responses[409] = {
      description: "이미 완료했거나, 도전 기록이 없는 경우",
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
                      errorCode: { type: "string", example: "M003" },
                      reason: {
                        type: "string",
                        example: "이미 완료한 미션입니다."
                      },
                      data: {
                        type: "object",
                        example: { missionId: 5, userId: 1 }
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
                      errorCode: { type: "string", example: "C000" },
                      reason: {
                        type: "string",
                        example: "해당 유저의 미션 도전 기록이 없습니다."
                      },
                      data: {
                        type: "object",
                        example: { missionId: 5, userId: 1 }
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
    const userId = Number(req.params.userId);
    const missionId = Number(req.params.missionId);

    const row = await markMissionCompleted(userId, missionId);

    res.status(StatusCodes.OK).success(serialize(row));
  } catch (err) {
    next(err);
  }
};
