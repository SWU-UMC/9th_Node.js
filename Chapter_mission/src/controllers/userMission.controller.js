// src/controllers/userMission.controller.js
import { StatusCodes } from "http-status-codes";
import {
  challengeMission,
  listActiveMissions,
  completeUserMission,
} from "../services/userMission.service.js";

// 미션 도전
export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.tags = ['UserMissions']
    #swagger.summary = '미션 도전'
    #swagger.description = '사용자가 특정 미션(mission_id)에 도전합니다.'

    #swagger.parameters['mission_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '도전할 미션 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $user_id: 1
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: '미션 도전 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            id: 10,
            userId: 1,
            missionId: 3,
            status: "IN_PROGRESS",
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-15T12:00:00.000Z"
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: '이미 도전 중인 미션인 경우',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  const missionId = Number(req.params.mission_id);
  const userId = Number(req.body.user_id);

  console.log("미션 도전 요청:", { missionId, userId });

  try {
    const challenge = await challengeMission(userId, missionId);
    res.status(StatusCodes.CREATED).success(challenge);
  } catch (error) {
    next(error);
  }
};

// 내가 진행 중인 미션 목록 조회
export const handleListActiveMissions = async (req, res, next) => {
  /*
    #swagger.tags = ['UserMissions']
    #swagger.summary = '진행 중인 미션 목록 조회'
    #swagger.description = '특정 사용자(user_id)가 현재 진행 중인 미션 목록을 조회합니다.'

    #swagger.parameters['user_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '사용자 ID'
    }

    #swagger.responses[200] = {
      description: '진행 중인 미션 목록 조회 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: [
            {
              id: 10,
              missionId: 3,
              missionTitle: "인증샷과 함께 리뷰 남기기",
              storeName: "홍대 떡볶이",
              storeAddress: "서울 마포구 홍익로 10",
              status: "IN_PROGRESS",
              startedAt: "2025-01-15T12:00:00.000Z"
            },
            {
              id: 11,
              missionId: 4,
              missionTitle: "친구와 함께 방문하기",
              storeName: "강남 김밥천국",
              storeAddress: "서울 강남구 역삼동 123-45",
              status: "IN_PROGRESS",
              startedAt: "2025-01-16T09:30:00.000Z"
            }
          ]
        }
      }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  const userId = Number(req.params.user_id);

  try {
    const result = await listActiveMissions(userId);

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 미션 완료
export const handleCompleteMission = async (req, res, next) => {
  /*
    #swagger.tags = ['UserMissions']
    #swagger.summary = '미션 완료 처리'
    #swagger.description = '사용자가 도전 중이던 미션(user_mission_id)을 완료 상태로 변경합니다.'

    #swagger.parameters['user_mission_id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: '사용자 미션(user_missions)의 ID'
    }

    #swagger.responses[200] = {
      description: '미션 완료 처리 성공',
      schema: {
        $ref: '#/components/schemas/SuccessResponse',
        example: {
          resultType: "SUCCESS",
          error: null,
          success: {
            id: 10,
            userId: 1,
            missionId: 3,
            status: "COMPLETED",
            createdAt: "2025-01-15T12:00:00.000Z",
            updatedAt: "2025-01-16T10:00:00.000Z"
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: '해당 user_mission_id에 대한 도전 정보가 없는 경우',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[409] = {
      description: '이미 완료된 미션을 다시 완료 처리하려는 경우',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }

    #swagger.responses[500] = {
      description: '서버 내부 오류',
      schema: { $ref: '#/components/schemas/ErrorResponse' }
    }
  */

  const userMissionId = parseInt(req.params.user_mission_id);

  console.log("미션 완료 요청:", userMissionId);

  try {
    const result = await completeUserMission(userMissionId);
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};