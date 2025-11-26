import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { 
  userSignUp,
  listUserReviews,
  listUserMissions,
  updateMyInfo,
} from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "test@example.com" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "MALE" },
              birth: { type: "string", example: "1999-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "101호" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              preferences: { type: "array", items: { type: "integer" }, example: [1, 3] }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원가입 성공 응답",
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "실패 응답 (이메일 중복 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).success(user);
};

export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회 API';
    #swagger.parameters['userId'] = { description: '사용자 ID', type: 'number' };
    #swagger.parameters['cursor'] = { description: '페이징 커서 (리뷰 ID)', type: 'number', required: false };
    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공 응답",
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
                        reviewId: { type: "number" },
                        content: { type: "string" },
                        rating: { type: "number" },
                        restaurantName: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  const reviews = await listUserReviews(
    parseInt(req.params.userId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};

export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.summary = '내가 진행 중인 미션 목록 조회 API';
    #swagger.parameters['userId'] = { description: '사용자 ID', type: 'number' };
    #swagger.parameters['cursor'] = { description: '페이징 커서', type: 'number', required: false };
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
                        userMissionId: { type: "number" },
                        status: { type: "string", example: "진행중" },
                        mission: {
                          type: "object",
                          properties: {
                            point: { type: "number" },
                            content: { type: "string" }
                          }
                        }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  const missions = await listUserMissions(
    parseInt(req.params.userId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(missions);
};

// 내 정보 수정 컨트롤러
export const handleUpdateMyInfo = async (req, res, next) => {
  /*
    #swagger.summary = '내 정보 수정 API';
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "MALE" },
              birth: { type: "string", example: "1999-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "101호" },
              phoneNumber: { type: "string", example: "010-1234-5678" }
            }
          }
        }
      }
    };
  */
  console.log("내 정보 수정을 요청했습니다!");
  console.log("body:", req.body);

  // 🚨 중요: userId는 req.body가 아니라 req.user.id (토큰)에서 가져옵니다.
  const updatedUser = await updateMyInfo(req.user.id, req.body);
  res.status(StatusCodes.OK).success(updatedUser);
};