import { StatusCodes } from "http-status-codes";
import {
  bodyToMission,
  bodyToChallenge,
  paramsToCompleteMission 
} from "../dtos/mission.dto.js";
import {
  createMission,
  challengeMission,
  completeMission,
} from "../services/mission.service.js";

export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 추가 API';
    #swagger.parameters['restaurantId'] = { description: '가게 ID', type: 'number' };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              point: { type: "number", example: 500 },
              content: { type: "string", example: "1만원 이상 구매" },
              deadline: { type: "string", format: "date", example: "2025-12-31" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 추가 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              success: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  content: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
  */
  console.log("가게에 미션 추가를 요청했습니다!");
  const missionData = bodyToMission(req.body, req.params);
  const newMission = await createMission(missionData);
  res.status(StatusCodes.CREATED).success(newMission);
};

export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['missionId'] = { description: '미션 ID', type: 'number' };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 도전 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              success: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  status: { type: "string", example: "진행중" }
                }
              }
            }
          }
        }
      }
    };
  */
  console.log("미션 도전하기를 요청했습니다");
  console.log("params (missionId):", req.params);
  console.log("user (from jwt):", req.user); // 토큰 정보 확인용

  // req.user.id를 DTO의 3번째 인자로 전달
  const challengeData = bodyToChallenge(req.body, req.params, req.user.id);

  const newChallenge = await challengeMission(challengeData);
  res.status(StatusCodes.CREATED).success(newChallenge);
};

export const handleCompleteMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 완료하기 API';
    #swagger.parameters['userMissionId'] = { description: '도전 내역 ID', type: 'number' };
    #swagger.responses[200] = {
      description: "미션 완료 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              success: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  status: { type: "string", example: "진행완료" }
                }
              }
            }
          }
        }
      }
    };
  */
  console.log("미션 완료를 요청했습니다!");
  const { userMissionId } = paramsToCompleteMission(req.params);
  const completedMission = await completeMission(userMissionId);
  res.status(StatusCodes.OK).success(completedMission);
};